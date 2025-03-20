import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Icon from "@mui/material/Icon";

import Dashboard from "layouts/dashboard";
import StudentDashboard from "layouts/dashboardstudent";
import PractitionerDashboard from "layouts/dashboardpractitioner";
import Users from "layouts/tables";
import Rotations from "layouts/rotations";
import Checkin from "layouts/checkin";
import Events from "layouts/events";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import User from "layouts/user";
import Knowledgebase from "layouts/knowledgebase";
import FAQ from "layouts/faq";
import PermissionsView from "layouts/permissions";
import Settings from "layouts/settings";

// Helper functions
const getUserRole = () => localStorage.getItem("role");
const isAuthenticated = () => !!localStorage.getItem("authToken");
const hasAccess = (allowedRoles, role) => isAuthenticated() && allowedRoles.includes(role);
const useRoutes = () => {
  const [role, setRole] = useState(getUserRole() || ""); // Ensure role is never null

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(getUserRole() || ""); // Update role on storage changes
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // If not authenticated, redirect to Sign In
  if (!isAuthenticated()) return [{ route: "/authentication/sign-in", component: <SignIn /> }];

  let roleRoutes = [];

  // Default dashboard route
  let dashboardRoute = {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  };

  // Ensure Students and Practitioners route properly
  if (role === "Admin" || role === "SuperAdmin") {
    roleRoutes.push(
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard",
        route: "/dashboard",
        component: <Dashboard />,
        icon: <Icon fontSize="small">dashboard</Icon>,
        children: [
          {
            type: "sub-item",
            name: "Students",
            key: "dashboard-student",
            route: "/dashboard/student",
          },
          {
            type: "sub-item",
            name: "Practitioners",
            key: "dashboard-practitioner",
            route: "/dashboard/practitioner",
          },
        ],
      },
      {
        route: "/dashboard/student",
        component: <StudentDashboard />,
      },
      {
        route: "/dashboard/practitioner",
        component: <PractitionerDashboard />,
      }
    );
  } else {
    roleRoutes.push(dashboardRoute);
  }

  // Additional role-based routes
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

  if (role === "Admin" || role === "SuperAdmin") {
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
      },
      {
        type: "collapse",
        name: "Settings",
        key: "setttings",
        icon: <Icon fontSize="small">settings</Icon>,
        route: "/settings",
        component: <Settings />,
      },
      {
        key: "permissions",
        route: "/permissions",
        component: <PermissionsView />,
      }
    );
  }

  return [{ route: "/profile", component: <Profile /> }, ...roleRoutes];
};

export default useRoutes;
