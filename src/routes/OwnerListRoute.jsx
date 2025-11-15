// src/routes/OwnerListRoute.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { INITIAL_ITEMS, INITIAL_SHOPPING_LIST } from "../data";

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

  const [lists, setLists] = useState([
    {
      ...INITIAL_SHOPPING_LIST,
      isArchived: false,
      itemsCount: INITIAL_ITEMS.length,
      unresolvedCount: INITIAL_ITEMS.filter((item) => !item.isResolved).length,
    },
  ]);

  const activeLists = lists.filter((list) => !list.isArchived);
  const archivedLists = lists.filter((list) => list.isArchived);

  function handleCreateList() {
    alert("Vytvoření nového seznamu zatím není implementováno.");
  }

  function handleRename(listId, name) {
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, name } : list))
    );
  }

  function handleArchive(listId) {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, isArchived: true } : list
      )
    );
  }

  function handleRestore(listId) {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, isArchived: false } : list
      )
    );
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateList}
          >
            + Nový seznam
          </button>
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
              Nemáš žádné aktivní nákupní seznamy.
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
                    onClick={() => navigate(`/owner_list/${list.id}`)}
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
                    onClick={() => navigate(`/owner_list/${list.id}`)}
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
            Pohled člena najdeš na <Link to="/member_list">/member_list</Link>.
          </span>
        </footer>
      </div>
    </div>
  );
}

export default OwnerListRoute;
