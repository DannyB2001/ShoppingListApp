// src/routes/OwnerListRoute.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOwnerDashboardLists, createList, updateListName, setListArchived } from "../services/listService";

function ListCard({ list, onRename, children }) {
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
            Uložit
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => {
              setEditing(false);
              setValue(list.name);
            }}
          >
            Zrušit
          </button>
        </form>
      ) : (
        <div className="list-card-row">
          <h3>{list.name}</h3>
          <button
            type="button"
            className="icon-button"
            onClick={() => setEditing(true)}
            aria-label="Přejmenovat seznam"
          >
            Upravit
          </button>
        </div>
      )}
      <div className="list-card-body">{children}</div>
    </article>
  );
}

function OwnerListRoute() {
  const navigate = useNavigate();
  const identity = { id: "user-1", name: "Daniel Novák" };
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
          setLoadState({ status: "error", error: "Nepodařilo se načíst seznamy." });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [identity.id]);

  if (loadState.status === "pending") {
    return (
      <div className="page-root">
        <div className="page-card">
          <p className="row-label-muted">Načítám seznamy…</p>
        </div>
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="page-root">
        <div className="page-card">
          <p className="row-label-muted">{loadState.error}</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Zkusit znovu
          </button>
        </div>
      </div>
    );
  }

  const activeLists = lists.filter((list) => !list.isArchived);
  const archivedLists = lists.filter((list) => list.isArchived);

  async function handleCreateList() {
    const name = window.prompt("Zadej název nového seznamu");
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
      alert("Vytvoření seznamu selhalo.");
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
      alert("Přejmenování selhalo.");
    }
  }

  async function handleArchive(listId) {
    try {
      const updated = await setListArchived({ id: listId, isArchived: true });
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? normalizeList(updated) : list))
      );
    } catch (error) {
      alert("Archivace selhala.");
    }
  }

  async function handleRestore(listId) {
    try {
      const updated = await setListArchived({ id: listId, isArchived: false });
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? normalizeList(updated) : list))
      );
    } catch (error) {
      alert("Obnovení selhalo.");
    }
  }

  return (
    <div className="page-root">
      <div className="page-card">
        <header className="detail-header">
          <div className="detail-title-block">
            <h1 className="title-text">Moje nákupní seznamy</h1>
            <p className="title-subtext">
              Přehled všech nákupních seznamů, kde jsi vlastníkem.
            </p>
          </div>
          <div className="dashboard-options-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleGoHome}
            >
              ← Hlavní stránka
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreateList}
            >
              + Nový seznam
            </button>
          </div>
        </header>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Moje správa</div>
              <h2>Aktivní seznamy</h2>
            </div>
            <span className="row-label-muted">{activeLists.length} celkem</span>
          </div>

          {!activeLists.length && (
            <p className="row-label-muted">
              Nemáte žádné aktivní nákupní seznamy.
            </p>
          )}

          <div className="list-grid">
            {activeLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onRename={(name) => handleRename(list.id, name)}
              >
                <div className="list-card-row">
                  <span className="row-label-muted">
                    {list.unresolvedCount} nevyřešených / {list.itemsCount} položek
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
                    Otevřít
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => handleArchive(list.id)}
                  >
                    Archivovat
                  </button>
                </div>
              </ListCard>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Historie</div>
              <h2>Archivované seznamy</h2>
            </div>
            <span className="row-label-muted">
              {archivedLists.length} celkem
            </span>
          </div>

          {!archivedLists.length && (
            <p className="row-label-muted">Žádné seznamy v archivu.</p>
          )}

          <div className="list-grid">
            {archivedLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onRename={(name) => handleRename(list.id, name)}
              >
                <div className="list-card-row">
                  <span className="row-label-muted">Archivováno</span>
                </div>
                <div className="list-card-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/owner_list/${list.id}`, { state: { list } })
                    }
                  >
                    Otevřít
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => handleRestore(list.id)}
                  >
                    Obnovit
                  </button>
                </div>
              </ListCard>
            ))}
          </div>
        </section>

        <footer className="detail-toolbar">
          <span className="row-label-muted">
            Pohled člena najdeš na <Link to="/member_dashboard">/member_dashboard</Link>.
          </span>
        </footer>
      </div>
    </div>
  );
}

export default OwnerListRoute;
