// src/routes/MemberListRoute.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { INITIAL_SHOPPING_LIST, INITIAL_MEMBERS } from "../data";

function MemberListRoute() {
  const navigate = useNavigate();
  const identity = { id: "user-2", name: "Alice" };

  const [lists] = useState([
    {
      ...INITIAL_SHOPPING_LIST,
      members: INITIAL_MEMBERS,
    },
  ]);

  const memberLists = useMemo(() => {
    return lists.filter((list) => {
      const isMember = list.members.some((member) => member.id === identity.id);
      const isOwner = list.ownerId === identity.id;
      return isMember && !isOwner;
    });
  }, [lists, identity.id]);

  return (
    <div className="page-root">
      <div className="page-card">
        <header className="detail-header">
          <div className="detail-title-block">
            <div className="title-row">
              <h1 className="title-text">Seznamy, kde jsem člen</h1>
            </div>
            <p className="title-subtext">
              Aktuální přehled nákupních seznamů, kam tě někdo pozval.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate("/")}
          >
            ← Hlavní stránka
          </button>
        </header>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Členský pohled</div>
              <h2>Aktivní seznamy</h2>
            </div>
            <span className="row-label-muted">
              {memberLists.length} celkem
            </span>
          </div>

          {!memberLists.length && (
            <p className="row-label-muted">Nejsi členem žádného seznamu.</p>
          )}

          <div className="list-grid">
            {memberLists.map((list) => (
              <article className="list-card" key={list.id}>
                <div className="list-card-row">
                  <h3>{list.name}</h3>
                </div>
                <div className="list-card-body">
                  <div className="list-card-row">
                    <span className="row-label-muted">
                      {list.members.length} členů
                    </span>
                  </div>
                  <div className="list-card-row">
                    <Link
                      className="btn btn-primary"
                      to={`/member_list/${list.id}`}
                      state={{ list }}
                    >
                      Otevřít
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MemberListRoute;
