// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OwnerListRoute from "./routes/OwnerListRoute.jsx";
import ShoppingListDetailRoute from "./routes/ShoppingListDetailRoute.jsx";
import MemberListRoute from "./routes/MemberListRoute.jsx";
import MemberListDetailRoute from "./routes/MemberListDetailRoute.jsx";
import DashboardRoute from "./routes/DashboardRoute.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/owner_dashboard" replace />} />
        <Route path="/owner_dashboard" element={<DashboardRoute />} />
        <Route path="/member_dashboard" element={<MemberListRoute />} />
        <Route path="/owner_list" element={<OwnerListRoute />} />
        <Route path="/owner_list/:listId" element={<ShoppingListDetailRoute />} />
        <Route path="/member_list" element={<MemberListRoute />} />
        <Route path="/member_list/:listId" element={<MemberListDetailRoute />} />
        <Route path="*" element={<DashboardRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
