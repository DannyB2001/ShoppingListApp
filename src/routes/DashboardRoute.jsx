// src/routes/DashboardRoute.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const IDENTITY = { id: "user-1", name: "Daniel" };

const INITIAL_DASHBOARD_LISTS = [
  {
    id: "list-1",
    name: "Velký nákup",
    ownerId: "user-1",
    ownerName: "Daniel",
    members: [
      { id: "user-1", name: "Daniel", isOwner: true },
      { id: "user-2", name: "Alice", isOwner: false },
    ],
    itemsCount: 8,
    unresolvedCount: 3,
    isArchived: false,
  },
  {
    id: "list-2",
    name: "Narozeniny",
    ownerId: "user-1",
    ownerName: "Daniel",
    members: [
      { id: "user-1", name: "Daniel", isOwner: true },
      { id: "user-3", name: "Bob", isOwner: false },
    ],
    itemsCount: 5,
    unresolvedCount: 1,
    isArchived: false,
  },
  {
    id: "list-3",
    name: "Víkend",
    ownerId: "user-3",
    ownerName: "Alice",
    members: [
      { id: "user-3", name: "Alice", isOwner: true },
      { id: "user-1", name: "Daniel", isOwner: false },
    ],
    itemsCount: 6,
    unresolvedCount: 2,
    isArchived: false,
  },
  {
    id: "list-4",
    name: "Archivovaný seznam",
    ownerId: "user-1",
    ownerName: "Daniel",
    members: [{ id: "user-1", name: "Daniel", isOwner: true }],
    itemsCount: 4,
    unresolvedCount: 0,
    isArchived: true,
  },
];

function DashboardRoute() {
  const [lists, setLists] = useState(INITIAL_DASHBOARD_LISTS);
  const [showArchived, setShowArchived] = useState(false);

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
    setLists((prev) => [
      {
        id: `list-${Date.now()}`,
        name: trimmed,
        ownerId: IDENTITY.id,
        ownerName: IDENTITY.name,
        members: [
          { id: IDENTITY.id, name: IDENTITY.name, isOwner: true },
        ],
        itemsCount: 0,
        unresolvedCount: 0,
        isArchived: false,
      },
      ...prev,
    ]);
  }

  function handleArchive(listId) {
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, isArchived: true } : list))
    );
  }

  function handleRestore(listId) {
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, isArchived: false } : list))
    );
  }

  function handleDelete(listId) {
    const confirmed = window.confirm("Opravdu smazat tento seznam?");
    if (!confirmed) return;
    setLists((prev) => prev.filter((list) => list.id !== listId));
  }

  function handleLeave(listId) {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, members: list.members.filter((member) => member.id !== IDENTITY.id) }
          : list
      )
    );
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
              ) : (
                <button type="button" className="btn btn-ghost" onClick={() => handleLeave(list.id)}>
                  Opustit
                </button>
              )}
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

          {!ownedLists.length && (
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

          {!invitedLists.length && (
            <p className="row-label-muted">Momentálně nejsi členem žádného seznamu.</p>
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
