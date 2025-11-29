// src/routes/DashboardRoute.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const IDENTITY = { id: "user-1", name: "Daniel" };

const INITIAL_DASHBOARD_LISTS = [
  {
    id: "list-1",
    name: "Velky nakup",
    ownerId: "user-1",
    ownerName: "Daniel",
    members: ["user-1", "user-2"],
    itemsCount: 8,
    unresolvedCount: 3,
    isArchived: false,
  },
  {
    id: "list-2",
    name: "Narozeniny",
    ownerId: "user-1",
    ownerName: "Daniel",
    members: ["user-1", "user-3"],
    itemsCount: 5,
    unresolvedCount: 1,
    isArchived: false,
  },
  {
    id: "list-3",
    name: "Vikend",
    ownerId: "user-3",
    ownerName: "Alice",
    members: ["user-1", "user-3"],
    itemsCount: 6,
    unresolvedCount: 2,
    isArchived: false,
  },
  {
    id: "list-4",
    name: "Archivovany seznam",
    ownerId: "user-1",
    ownerName: "Daniel",
    members: ["user-1"],
    itemsCount: 4,
    unresolvedCount: 0,
    isArchived: true,
  },
];

function DashboardRoute() {
  const navigate = useNavigate();
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
          list.ownerId !== IDENTITY.id && list.members.some((memberId) => memberId === IDENTITY.id)
      ),
    [visibleLists]
  );

  function handleCreate() {
    const name = window.prompt("Zadej nazev noveho seznamu");
    const trimmed = name?.trim();
    if (!trimmed) return;
    setLists((prev) => [
      {
        id: `list-${Date.now()}`,
        name: trimmed,
        ownerId: IDENTITY.id,
        ownerName: IDENTITY.name,
        members: [IDENTITY.id],
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
    setLists((prev) => prev.filter((list) => list.id !== listId));
  }

  function handleOpen(list) {
    const isOwner = list.ownerId === IDENTITY.id;
    navigate(isOwner ? `/owner_list/${list.id}` : `/member_list/${list.id}`);
  }

  function handleLeave(listId) {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, members: list.members.filter((memberId) => memberId !== IDENTITY.id) }
          : list
      )
    );
  }

  function renderListRow(list, isOwner) {
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
                {list.unresolvedCount} nevyresenych / {list.itemsCount} polozek
              </span>
              <span className="row-label-muted">{isOwner ? "Moje sprava" : "Jsem clen"}</span>
            </div>
            <div className="list-card-row">
              <button type="button" className="btn btn-primary" onClick={() => handleOpen(list)}>
                Otevrit
              </button>
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
            <h4 className="owner-card-title">Vlastnik</h4>
            <span className="row-label-muted">{list.members.length} clenu</span>
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
            <h1 className="title-text">Prehled nakupnich seznamu</h1>
            <p className="title-subtext">Rozdeleno podle role: vlastnik nebo pozvany clen.</p>
          </div>
        </header>

        <div className="dashboard-options">
          <span className="row-label-muted">Moznosti</span>
          <div className="dashboard-options-actions">
            <button type="button" className="btn btn-primary" onClick={handleCreate}>
              Vytvorit seznam
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowArchived((prev) => !prev)}
            >
              {showArchived ? "Zobrazit aktivni" : "Zobrazit archivovane"}
            </button>
          </div>
        </div>

        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Moje seznamy</div>
              <h2>Vlastnim</h2>
            </div>
            <span className="row-label-muted">{ownedLists.length} celkem</span>
          </div>

          {!ownedLists.length && (
            <p className="row-label-muted">Zadne seznamy ve sprave pro tento pohled.</p>
          )}

          <div className="dashboard-grid">
            {ownedLists.map((list) => renderListRow(list, true))}
          </div>
        </section>

        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Uzivatel</div>
              <h2>Jsem prizvany</h2>
            </div>
            <span className="row-label-muted">{invitedLists.length} celkem</span>
          </div>

          {!invitedLists.length && (
            <p className="row-label-muted">Momentalne nejsi clenem zadneho seznamu.</p>
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
