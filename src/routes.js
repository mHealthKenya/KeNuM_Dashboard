import React from "react";
import { Navigate } from "react-router-dom";
import Icon from "@mui/material/Icon";

import Dashboard from "layouts/dashboard";
import Users from "layouts/tables";
import Rotations from "layouts/rotations";
import Checkin from "layouts/checkin";
import Events from "layouts/events";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import User from "layouts/user";
import Knowledgebase from "layouts/knowledgebase";
import FAQ from "layouts/faq";
import DashboardCNO from "layouts_cno/dashboard";

// Helper functions
const getUserRole = () => localStorage.getItem("role");
const isAuthenticated = () => !!localStorage.getItem("authToken");
const hasAccess = (allowedRoles) => isAuthenticated() && allowedRoles.includes(getUserRole());

// Common routes (accessible to all users)
const commonRoutes = [
  { route: "/authentication/sign-in", component: <SignIn /> },
  {
    route: "/profile",
    component: isAuthenticated() ? <Profile /> : <Navigate to="/authentication/sign-in" replace />,
  },
];

// Routes for general users
const generalUserRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: isAuthenticated() ? (
      <Dashboard />
    ) : (
      <Navigate to="/authentication/sign-in" replace />
    ),
  },
];

// Routes for CNO users
const cnoRoutes = [
  {
    type: "collapse",
    name: "Rotations",
    key: "rotations",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/cno/rotations",
    component: hasAccess(["CNO"]) ? <Rotations /> : <Navigate to="/dashboard" replace />,
  },
  {
    type: "collapse",
    name: "Checkins",
    key: "checkin",
    icon: <Icon fontSize="small">task</Icon>,
    route: "/cno/checkins",
    component: hasAccess(["CNO"]) ? <Checkin /> : <Navigate to="/dashboard" replace />,
  },
];

// Routes for Provider users
const providerRoutes = [
  {
    type: "collapse",
    name: "CPD Events",
    key: "events",
    icon: <Icon fontSize="small">circle</Icon>,
    route: "/provider/events",
    component: hasAccess(["Provider"]) ? <Events /> : <Navigate to="/dashboard" replace />,
  },
];

// Routes for Admin users
const adminRoutes = [
  {
    type: "collapse",
    name: "Add User",
    key: "user",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/user",
    component: isAuthenticated() ? <User /> : <Navigate to="/authentication/sign-in" replace />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/users",
    component: isAuthenticated() ? <Users /> : <Navigate to="/authentication/sign-in" replace />,
  },
  {
    type: "collapse",
    name: "Knowledge Base",
    key: "knowledgebase",
    icon: <Icon fontSize="small">book</Icon>,
    route: "/knowledgebase",
    component: isAuthenticated() ? (
      <Knowledgebase />
    ) : (
      <Navigate to="/authentication/sign-in" replace />
    ),
  },
  {
    type: "collapse",
    name: "FAQs",
    key: "faq",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/faq",
    component: isAuthenticated() ? <FAQ /> : <Navigate to="/authentication/sign-in" replace />,
  },
];

// Custom hook to dynamically generate routes
const useRoutes = () => {
  const role = getUserRole();
  if (!isAuthenticated()) return commonRoutes;

  let roleRoutes = [...generalUserRoutes];
  if (role === "CNO") roleRoutes = [...roleRoutes, ...cnoRoutes];
  if (role === "Provider") roleRoutes = [...roleRoutes, ...providerRoutes];
  if (role === "Admin") roleRoutes = [...roleRoutes, ...adminRoutes];

  return [...commonRoutes, ...roleRoutes];
};

export default useRoutes;
