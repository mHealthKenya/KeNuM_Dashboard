import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Rotations from "layouts/rotations";
import Checkin from "layouts/checkin";
import Events from "layouts/events";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import User from "layouts/user";

// @mui icons
import Icon from "@mui/material/Icon";
import Knowledgebase from "layouts/knowledgebase";
import FAQ from "layouts/faq";
import DashboardCNO from "layouts_cno/dashboard";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
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
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
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
  },
  {
    type: "collapse",
    name: "CPD Events",
    key: "events",
    icon: <Icon fontSize="small">circle</Icon>,
    route: "/events",
    component: <Events />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
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
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },

  {
    // type: "collapse",
    // name: "Sign In",
    // key: "sign-in",
    // icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },

  {
    // type: "collapse",
    // name: "Sign In",
    // key: "sign-in",
    // icon: <Icon fontSize="small">login</Icon>,
    route: "/dashboard/cno",
    component: <DashboardCNO />,
  },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
];

export default routes;
