import { useState, useEffect } from "react";
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
const hasAccess = (allowedRoles, role) => isAuthenticated() && allowedRoles.includes(role);

const useRoutes = () => {
  const [role, setRole] = useState(getUserRole());

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(getUserRole());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!isAuthenticated()) return [{ route: "/authentication/sign-in", component: <SignIn /> }];

  let roleRoutes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: <Dashboard />,
    },
  ];

  if (role === "CNO") {
    roleRoutes.push(
      {
        type: "collapse",
        name: "Rotations",
        key: "rotations",
        icon: <Icon fontSize="small">list</Icon>,
        route: "/rotations",
        component: <Rotations />,
      },
      {
        type: "collapse",
        name: "Checkins",
        key: "checkin",
        icon: <Icon fontSize="small">task</Icon>,
        route: "/checkins",
        component: <Checkin />,
      }
    );
  }

  if (role === "Provider") {
    roleRoutes.push({
      type: "collapse",
      name: "CPD Events",
      key: "events",
      icon: <Icon fontSize="small">circle</Icon>,
      route: "/events",
      component: <Events />,
    });
  }

  if (role === "Admin") {
    roleRoutes.push(
      {
        type: "collapse",
        name: "Add User",
        key: "user",
        icon: <Icon fontSize="small">add</Icon>,
        route: "/user",
        component: <User />,
      },
      {
        type: "collapse",
        name: "Users",
        key: "users",
        icon: <Icon fontSize="small">table_view</Icon>,
        route: "/users",
        component: <Users />,
      },
      {
        type: "collapse",
        name: "Knowledge Base",
        key: "knowledgebase",
        icon: <Icon fontSize="small">book</Icon>,
        route: "/knowledgebase",
        component: <Knowledgebase />,
      },
      {
        type: "collapse",
        name: "FAQs",
        key: "faq",
        icon: <Icon fontSize="small">notifications</Icon>,
        route: "/faq",
        component: <FAQ />,
      }
    );
  }

  return [{ route: "/profile", component: <Profile /> }, ...roleRoutes];
};

export default useRoutes;
