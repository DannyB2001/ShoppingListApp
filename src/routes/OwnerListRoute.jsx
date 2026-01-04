// src/routes/OwnerListRoute.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getOwnerDashboardLists,
  createList,
  updateListName,
  setListArchived,
} from "../services/listService";
import AppToolbar from "./components/AppToolbar";
import ListOverviewChart from "./components/ListOverviewChart";
import { usePreferences } from "../context/PreferencesContext";

function ListCard({ list, onRename, children }) {
  const { t } = usePreferences();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(list.name);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setValue(list.name);
      setEditing(false);
      return;
    }
    onRename(trimmed);
    setEditing(false);
  }

  return (
    <article className="list-card">
      {editing ? (
        <form className="detail-inline-form" onSubmit={handleSubmit}>
          <input
            className="inline-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-small">
            {t("common.save")}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => {
              setEditing(false);
              setValue(list.name);
            }}
          >
            {t("common.cancel")}
          </button>
        </form>
      ) : (
        <div className="list-card-row">
          <h3>{list.name}</h3>
          <button
            type="button"
            className="icon-button"
            onClick={() => setEditing(true)}
            aria-label={t("ownerLists.renameAria")}
          >
            {t("common.edit")}
          </button>
        </div>
      )}
      <div className="list-card-body">{children}</div>
    </article>
  );
}

function OwnerListRoute() {
  const { t } = usePreferences();
  const navigate = useNavigate();
  const identity = { id: "user-1", name: "Daniel Novak" };
  const [loadState, setLoadState] = useState({ status: "pending", error: null });

  function normalizeList(list) {
    const items = list.items ?? [];
    return {
      ...list,
      itemsCount: list.itemsCount ?? items.length,
      unresolvedCount: list.unresolvedCount ?? items.filter((item) => !item.isResolved).length,
      members: list.members ?? [],
      isArchived: Boolean(list.isArchived),
    };
  }

  const [lists, setLists] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadState({ status: "pending", error: null });
      try {
        const fetched = await getOwnerDashboardLists(identity.id);
        if (!cancelled) {
          setLists(fetched.map(normalizeList));
          setLoadState({ status: "ready", error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setLoadState({ status: "error", error: t("ownerLists.loadError") });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [identity.id, t]);

  if (loadState.status === "pending") {
    return (
      <div className="page-root">
        <div className="page-card">
          <AppToolbar />
          <p className="row-label-muted">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="page-root">
        <div className="page-card">
          <AppToolbar />
          <p className="row-label-muted">{loadState.error}</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            {t("ownerLists.retry")}
          </button>
        </div>
      </div>
    );
  }

  const activeLists = lists.filter((list) => !list.isArchived);
  const archivedLists = lists.filter((list) => list.isArchived);

  const chartData = useMemo(
    () =>
      activeLists.map((list) => ({
        name: list.name,
        itemsCount: list.itemsCount ?? 0,
      })),
    [activeLists]
  );

  async function handleCreateList() {
    const name = window.prompt(t("ownerLists.createPrompt"));
    const trimmed = name?.trim();
    if (!trimmed) return;
    try {
      const created = await createList({
        id: `list-${Date.now()}`,
        name: trimmed,
        ownerId: identity.id,
        members: [{ id: identity.id, name: identity.name, isOwner: true }],
        items: [],
        isArchived: false,
      });
      setLists((prev) => [normalizeList(created), ...prev]);
    } catch (error) {
      alert(t("ownerLists.createError"));
    }
  }

  function handleGoHome() {
    navigate("/");
  }

  async function handleRename(listId, name) {
    try {
      const updated = await updateListName({ id: listId, name });
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? normalizeList(updated) : list))
      );
    } catch (error) {
      alert(t("ownerLists.renameError"));
    }
  }

  async function handleArchive(listId) {
    try {
      const updated = await setListArchived({ id: listId, isArchived: true });
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? normalizeList(updated) : list))
      );
    } catch (error) {
      alert(t("ownerLists.archiveError"));
    }
  }

  async function handleRestore(listId) {
    try {
      const updated = await setListArchived({ id: listId, isArchived: false });
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? normalizeList(updated) : list))
      );
    } catch (error) {
      alert(t("ownerLists.restoreError"));
    }
  }

  return (
    <div className="page-root">
      <div className="page-card">
        <AppToolbar />
        <header className="detail-header">
          <div className="detail-title-block">
            <h1 className="title-text">{t("ownerLists.title")}</h1>
            <p className="title-subtext">{t("ownerLists.subtitle")}</p>
          </div>
          <div className="dashboard-options-actions">
            <button type="button" className="btn btn-ghost" onClick={handleGoHome}>
              {"<-"} {t("ownerLists.home")}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreateList}>
              + {t("ownerLists.newList")}
            </button>
          </div>
        </header>

        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("ownerLists.activeEyebrow")}</div>
              <h2>{t("ownerLists.chartTitle")}</h2>
            </div>
          </div>
          <ListOverviewChart data={chartData} />
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("ownerLists.activeEyebrow")}</div>
              <h2>{t("ownerLists.activeTitle")}</h2>
            </div>
            <span className="row-label-muted">{t("common.total", { count: activeLists.length })}</span>
          </div>

          {!activeLists.length && (
            <p className="row-label-muted">{t("ownerLists.activeEmpty")}</p>
          )}

          <div className="list-grid">
            {activeLists.map((list) => (
              <ListCard key={list.id} list={list} onRename={(name) => handleRename(list.id, name)}>
                <div className="list-card-row">
                  <span className="row-label-muted">
                    {t("listCard.unresolvedSummary", {
                      unresolved: list.unresolvedCount,
                      total: list.itemsCount,
                    })}
                  </span>
                </div>
                <div className="list-card-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/owner_list/${list.id}`, { state: { list } })
                    }
                  >
                    {t("common.open")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => handleArchive(list.id)}
                  >
                    {t("common.archive")}
                  </button>
                </div>
              </ListCard>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("ownerLists.archiveEyebrow")}</div>
              <h2>{t("ownerLists.archiveTitle")}</h2>
            </div>
            <span className="row-label-muted">{t("common.total", { count: archivedLists.length })}</span>
          </div>

          {!archivedLists.length && (
            <p className="row-label-muted">{t("ownerLists.archiveEmpty")}</p>
          )}

          <div className="list-grid">
            {archivedLists.map((list) => (
              <ListCard key={list.id} list={list} onRename={(name) => handleRename(list.id, name)}>
                <div className="list-card-row">
                  <span className="row-label-muted">{t("ownerLists.archivedLabel")}</span>
                </div>
                <div className="list-card-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/owner_list/${list.id}`, { state: { list } })
                    }
                  >
                    {t("common.open")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => handleRestore(list.id)}
                  >
                    {t("common.restore")}
                  </button>
                </div>
              </ListCard>
            ))}
          </div>
        </section>

        <footer className="detail-toolbar">
          <span className="row-label-muted">
            {t("ownerLists.memberFooter")} <Link to="/member_dashboard">/member_dashboard</Link>.
          </span>
        </footer>
      </div>
    </div>
  );
}

export default OwnerListRoute;
