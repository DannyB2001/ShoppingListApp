// src/routes/DashboardRoute.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getOwnerDashboardLists,
  createList,
  setListArchived,
  deleteList,
  addMemberToList,
  getAllLists,
} from "../services/listService";
import AppToolbar from "./components/AppToolbar";
import ListOverviewChart from "./components/ListOverviewChart";
import { usePreferences } from "../context/PreferencesContext";

const IDENTITY = { id: "user-1", name: "Daniel" };

function DashboardRoute() {
  const { t } = usePreferences();
  const [lists, setLists] = useState([]);
  const [loadState, setLoadState] = useState({ status: "pending", error: null });
  const [showArchived, setShowArchived] = useState(false);
  const [rejoinTarget, setRejoinTarget] = useState(null);

  const shapeList = (list) => ({
    ...list,
    itemsCount: list.items?.length ?? 0,
    unresolvedCount: list.items?.filter((item) => !item.isResolved).length ?? 0,
    ownerName:
      list.members?.find((member) => member.id === list.ownerId)?.name ??
      list.ownerId ??
      t("dashboard.ownerCardTitle"),
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadState({ status: "pending", error: null });
      try {
        const response = await getOwnerDashboardLists(IDENTITY.id);
        if (!cancelled) {
          const withCounts = response.map(shapeList);
          setLists(withCounts);
          setLoadState({ status: "ready", error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setLoadState({ status: "error", error: t("dashboard.loadError") });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    async function loadRejoin() {
      try {
        const all = await getAllLists();
        if (cancelled) return;
        const candidate = all.find(
          (list) =>
            list.ownerId !== IDENTITY.id &&
            !list.isArchived &&
            !list.members.some((member) => member.id === IDENTITY.id)
        );
        if (candidate) setRejoinTarget(shapeList(candidate));
      } catch (error) {
        // optional helper for testing
      }
    }
    loadRejoin();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const visibleLists = useMemo(
    () => lists.filter((list) => (showArchived ? list.isArchived : !list.isArchived)),
    [lists, showArchived]
  );

  const ownedLists = useMemo(
    () => visibleLists.filter((list) => list.ownerId === IDENTITY.id),
    [visibleLists]
  );

  const invitedLists = useMemo(
    () =>
      visibleLists.filter(
        (list) =>
          list.ownerId !== IDENTITY.id &&
          list.members.some((member) => member.id === IDENTITY.id)
      ),
    [visibleLists]
  );

  const chartData = useMemo(
    () =>
      visibleLists.map((list) => ({
        name: list.name,
        itemsCount: list.itemsCount ?? 0,
      })),
    [visibleLists]
  );

  function handleCreate() {
    const name = window.prompt(t("dashboard.createPrompt"));
    const trimmed = name?.trim();
    if (!trimmed) return;
    createList({
      id: `list-${Date.now()}`,
      name: trimmed,
      ownerId: IDENTITY.id,
      members: [{ id: IDENTITY.id, name: IDENTITY.name, isOwner: true }],
      items: [],
      isArchived: false,
    })
      .then((created) => {
        setLists((prev) => [shapeList(created), ...prev]);
      })
      .catch(() => alert(t("dashboard.createError")));
  }

  function handleArchive(listId) {
    setListArchived({ id: listId, isArchived: true })
      .then((updated) => {
        setLists((prev) =>
          prev.map((list) => (list.id === listId ? shapeList(updated) : list))
        );
      })
      .catch(() => alert(t("dashboard.archiveError")));
  }

  function handleRestore(listId) {
    setListArchived({ id: listId, isArchived: false })
      .then((updated) => {
        setLists((prev) =>
          prev.map((list) => (list.id === listId ? shapeList(updated) : list))
        );
      })
      .catch(() => alert(t("dashboard.restoreError")));
  }

  function handleDelete(listId) {
    const confirmed = window.confirm(t("dashboard.deleteConfirm"));
    if (!confirmed) return;
    deleteList(listId)
      .then(() => {
        setLists((prev) => prev.filter((list) => list.id !== listId));
      })
      .catch(() => alert(t("dashboard.deleteError")));
  }

  function handleRejoin(listId) {
    addMemberToList({ id: listId, memberId: IDENTITY.id, isOwner: false })
      .then((updated) => {
        setLists((prev) =>
          prev.some((list) => list.id === updated.id)
            ? prev.map((list) => (list.id === updated.id ? shapeList(updated) : list))
            : [...prev, shapeList(updated)]
        );
        setRejoinTarget(null);
      })
      .catch(() => alert(t("dashboard.rejoinError")));
  }

  function renderListRow(list, isOwner) {
    const targetHref = isOwner ? `/owner_list/${list.id}` : `/member_list/${list.id}`;

    return (
      <React.Fragment key={list.id}>
        <article className="list-card">
          <div className="list-card-row">
            <h3>{list.name}</h3>
            {list.isArchived && <span className="badge">{t("common.archived")}</span>}
          </div>
          <div className="list-card-body">
            <div className="list-card-row">
              <span className="row-label-muted">
                {t("listCard.unresolvedSummary", {
                  unresolved: list.unresolvedCount,
                  total: list.itemsCount,
                })}
              </span>
              <span className="row-label-muted">
                {isOwner ? t("dashboard.ownerLabel") : t("dashboard.memberLabel")}
              </span>
            </div>
            <div className="list-card-row">
              <Link className="btn btn-primary" to={targetHref} state={{ list }}>
                {t("common.open")}
              </Link>
              {isOwner ? (
                <>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() =>
                      list.isArchived ? handleRestore(list.id) : handleArchive(list.id)
                    }
                  >
                    {list.isArchived ? t("common.restore") : t("common.archive")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(list.id)}
                  >
                    {t("common.delete")}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </article>
        <div className="list-card owner-card">
          <div className="list-card-row">
            <h4 className="owner-card-title">{t("dashboard.ownerCardTitle")}</h4>
            <span className="row-label-muted">
              {t("common.membersCount", { count: list.members.length })}
            </span>
          </div>
          <div className="owner-card-name">{list.ownerName}</div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="page-root">
      <div className="page-card">
        <AppToolbar />
        <header className="detail-header">
          <div className="detail-title-block">
            <h1 className="title-text">{t("dashboard.title")}</h1>
            <p className="title-subtext">{t("dashboard.subtitle")}</p>
          </div>
        </header>

        <div className="dashboard-options">
          <span className="row-label-muted">{t("dashboard.options")}</span>
          <div className="dashboard-options-actions">
            <button type="button" className="btn btn-primary" onClick={handleCreate}>
              {t("dashboard.createList")}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowArchived((prev) => !prev)}
            >
              {showArchived ? t("dashboard.showActive") : t("dashboard.showArchived")}
            </button>
          </div>
        </div>

        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("dashboard.ownerSectionEyebrow")}</div>
              <h2>{t("dashboard.chartTitle")}</h2>
            </div>
          </div>
          <ListOverviewChart data={chartData} />
        </section>

        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("dashboard.ownerSectionEyebrow")}</div>
              <h2>{t("dashboard.ownerSectionTitle")}</h2>
            </div>
            <span className="row-label-muted">{t("common.total", { count: ownedLists.length })}</span>
          </div>

          {loadState.status === "pending" && (
            <p className="row-label-muted">{t("dashboard.loading")}</p>
          )}
          {loadState.status === "error" && (
            <p className="row-label-muted">{loadState.error}</p>
          )}
          {!ownedLists.length && loadState.status === "ready" && (
            <p className="row-label-muted">{t("dashboard.emptyOwner")}</p>
          )}

          <div className="dashboard-grid">
            {ownedLists.map((list) => renderListRow(list, true))}
          </div>
        </section>

        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("dashboard.memberSectionEyebrow")}</div>
              <h2>{t("dashboard.memberSectionTitle")}</h2>
            </div>
            <span className="row-label-muted">
              {t("common.total", { count: invitedLists.length })}
            </span>
          </div>

          {loadState.status === "pending" && (
            <p className="row-label-muted">{t("dashboard.loading")}</p>
          )}
          {loadState.status === "error" && (
            <p className="row-label-muted">{loadState.error}</p>
          )}
          {!invitedLists.length && loadState.status === "ready" && (
            <div className="list-card-row">
              <p className="row-label-muted">{t("dashboard.emptyMember")}</p>
              {rejoinTarget && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleRejoin(rejoinTarget.id)}
                >
                  {t("dashboard.rejoin", { name: rejoinTarget.name })}
                </button>
              )}
            </div>
          )}

          <div className="dashboard-grid">
            {invitedLists.map((list) => renderListRow(list, false))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardRoute;
