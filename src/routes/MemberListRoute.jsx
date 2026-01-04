// src/routes/MemberListRoute.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMemberDashboardLists } from "../services/listService";
import AppToolbar from "./components/AppToolbar";
import ListOverviewChart from "./components/ListOverviewChart";
import { usePreferences } from "../context/PreferencesContext";

function MemberListRoute() {
  const { t } = usePreferences();
  const navigate = useNavigate();
  const identity = { id: "user-1", name: "Daniel Novak" };

  const [lists, setLists] = useState([]);
  const [loadState, setLoadState] = useState({ status: "pending", error: null });

  const shapeList = (list) => ({
    ...list,
    itemsCount: list.items?.length ?? 0,
    unresolvedCount: list.items?.filter((item) => !item.isResolved).length ?? 0,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadState({ status: "pending", error: null });
      try {
        const response = await getMemberDashboardLists(identity.id);
        if (!cancelled) {
          setLists(response.map(shapeList));
          setLoadState({ status: "ready", error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setLoadState({ status: "error", error: t("memberLists.loadError") });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [identity.id, t]);

  const memberLists = useMemo(() => {
    return lists.filter((list) => {
      const isMember = list.members.some((member) => member.id === identity.id);
      const isOwner = list.ownerId === identity.id;
      return isMember && !isOwner;
    });
  }, [lists, identity.id]);

  const chartData = useMemo(
    () =>
      memberLists.map((list) => ({
        name: list.name,
        itemsCount: list.itemsCount ?? 0,
      })),
    [memberLists]
  );

  return (
    <div className="page-root">
      <div className="page-card">
        <AppToolbar />
        <header className="detail-header">
          <div className="detail-title-block">
            <div className="title-row">
              <h1 className="title-text">{t("memberLists.title")}</h1>
            </div>
            <p className="title-subtext">{t("memberLists.subtitle")}</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/")}>
            {"<-"} {t("memberLists.home")}
          </button>
        </header>

        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("memberLists.eyebrow")}</div>
              <h2>{t("memberLists.chartTitle")}</h2>
            </div>
          </div>
          <ListOverviewChart data={chartData} />
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("memberLists.eyebrow")}</div>
              <h2>{t("memberLists.activeTitle")}</h2>
            </div>
            <span className="row-label-muted">{t("common.total", { count: memberLists.length })}</span>
          </div>

          {loadState.status === "pending" && (
            <p className="row-label-muted">{t("dashboard.loading")}</p>
          )}
          {loadState.status === "error" && (
            <p className="row-label-muted">{loadState.error}</p>
          )}
          {!memberLists.length && loadState.status === "ready" && (
            <p className="row-label-muted">{t("memberLists.empty")}</p>
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
                      {t("common.membersCount", { count: list.members.length })},{" "}
                      {t("listCard.unresolvedSummary", {
                        unresolved: list.unresolvedCount ?? 0,
                        total: list.itemsCount ?? 0,
                      })}
                    </span>
                  </div>
                  <div className="list-card-row">
                    <Link className="btn btn-primary" to={`/member_list/${list.id}`} state={{ list }}>
                      {t("common.open")}
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
