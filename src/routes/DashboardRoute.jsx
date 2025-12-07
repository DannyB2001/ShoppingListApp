// src/routes/DashboardRoute.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getOwnerDashboardLists,
  createList,
  setListArchived,
  deleteList,
  removeMemberFromList,
  addMemberToList,
  getAllLists,
} from "../services/listService";

const IDENTITY = { id: "user-1", name: "Daniel" };

function DashboardRoute() {
  const [lists, setLists] = useState([]);
  const [loadState, setLoadState] = useState({ status: "pending", error: null });
  const [showArchived, setShowArchived] = useState(false);
  const [rejoinTarget, setRejoinTarget] = useState(null);

  const shapeList = (list) => ({
    ...list,
    itemsCount: list.items?.length ?? 0,
    unresolvedCount: list.items?.filter((item) => !item.isResolved).length ?? 0,
    ownerName: list.members?.find((m) => m.id === list.ownerId)?.name ?? list.ownerId ?? "Vlastník",
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
          setLoadState({ status: "error", error: "Nepodařilo se načíst seznamy." });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

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
            !list.members.some((m) => m.id === IDENTITY.id)
        );
        if (candidate) setRejoinTarget(shapeList(candidate));
      } catch (error) {
        // swallow: optional helper for testing
      }
    }
    loadRejoin();
    return () => {
      cancelled = true;
    };
  }, []);

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

  function handleCreate() {
    const name = window.prompt("Zadej název nového seznamu");
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
        setLists((prev) => [
          shapeList(created),
          ...prev,
        ]);
      })
      .catch(() => alert("Vytvoření seznamu selhalo."));
  }

  function handleArchive(listId) {
    setListArchived({ id: listId, isArchived: true })
      .then((updated) => {
        setLists((prev) =>
          prev.map((list) => (list.id === listId ? shapeList(updated) : list))
        );
      })
      .catch(() => alert("Archivace se nezdařila."));
  }

  function handleRestore(listId) {
    setListArchived({ id: listId, isArchived: false })
      .then((updated) => {
        setLists((prev) =>
          prev.map((list) => (list.id === listId ? shapeList(updated) : list))
        );
      })
      .catch(() => alert("Obnovení se nezdařilo."));
  }

  function handleDelete(listId) {
    const confirmed = window.confirm("Opravdu smazat tento seznam?");
    if (!confirmed) return;
    deleteList(listId)
      .then(() => {
        setLists((prev) => prev.filter((list) => list.id !== listId));
      })
      .catch(() => alert("Smazání se nezdařilo."));
  }

  function handleLeave(listId) {
    removeMemberFromList({ id: listId, memberId: IDENTITY.id })
      .then((updated) => {
        setLists((prev) =>
          prev.map((list) => (list.id === listId ? shapeList(updated) : list))
        );
      })
      .catch(() => alert("Nepodařilo se opustit seznam."));
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
      .catch(() => alert("Nepodařilo se znovu připojit k seznamu."));
  }

  function renderListRow(list, isOwner) {
    const targetHref = isOwner ? `/owner_list/${list.id}` : `/member_list/${list.id}`;

    return (
      <React.Fragment key={list.id}>
        <article className="list-card">
          <div className="list-card-row">
            <h3>{list.name}</h3>
            {list.isArchived && <span className="badge">Archiv</span>}
          </div>
          <div className="list-card-body">
            <div className="list-card-row">
              <span className="row-label-muted">
                {list.unresolvedCount} nevyřešených / {list.itemsCount} položek
              </span>
              <span className="row-label-muted">{isOwner ? "Moje správa" : "Jsem člen"}</span>
            </div>
            <div className="list-card-row">
              <Link
                className="btn btn-primary"
                to={targetHref}
                state={{ list }}
              >
                Otevřít
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
                    {list.isArchived ? "Obnovit" : "Archivovat"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(list.id)}
                  >
                    Smazat
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </article>
        <div className="list-card owner-card">
          <div className="list-card-row">
            <h4 className="owner-card-title">Vlastník</h4>
            <span className="row-label-muted">{list.members.length} členů</span>
          </div>
          <div className="owner-card-name">{list.ownerName}</div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="page-root">
      <div className="page-card">
        <header className="detail-header">
          <div className="detail-title-block">
            <h1 className="title-text">Přehled nákupních seznamů</h1>
            <p className="title-subtext">Rozděleno podle role: vlastník nebo pozvaný člen.</p>
          </div>
        </header>

        <div className="dashboard-options">
          <span className="row-label-muted">Možnosti</span>
          <div className="dashboard-options-actions">
            <button type="button" className="btn btn-primary" onClick={handleCreate}>
              Vytvořit seznam
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowArchived((prev) => !prev)}
            >
              {showArchived ? "Zobrazit aktivní" : "Zobrazit archivované"}
            </button>
          </div>
        </div>

        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Moje seznamy</div>
              <h2>Vlastním</h2>
            </div>
            <span className="row-label-muted">{ownedLists.length} celkem</span>
          </div>

          {loadState.status === "pending" && (
            <p className="row-label-muted">Načítám seznamy…</p>
          )}
          {loadState.status === "error" && (
            <p className="row-label-muted">{loadState.error}</p>
          )}
          {!ownedLists.length && loadState.status === "ready" && (
            <p className="row-label-muted">Žádné seznamy ve správě pro tento pohled.</p>
          )}

          <div className="dashboard-grid">
            {ownedLists.map((list) => renderListRow(list, true))}
          </div>
        </section>

        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Uživatel</div>
              <h2>Jsem přizvaný</h2>
            </div>
            <span className="row-label-muted">{invitedLists.length} celkem</span>
          </div>

          {loadState.status === "pending" && (
            <p className="row-label-muted">Načítám seznamy…</p>
          )}
          {loadState.status === "error" && (
            <p className="row-label-muted">{loadState.error}</p>
          )}
          {!invitedLists.length && loadState.status === "ready" && (
            <div className="list-card-row">
              <p className="row-label-muted">Momentálně nejsi členem žádného seznamu.</p>
              {rejoinTarget && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleRejoin(rejoinTarget.id)}
                >
                  Znovu se připojit k „{rejoinTarget.name}“
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
