import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import FAQ from "layouts/faq";
import Knowledgebase from "layouts/knowledgebase";

const adminRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: "dashboard",
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: "person",
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Knowledge Base",
    key: "knowledgebase",
    icon: "book",
    route: "/knowledgebase",
    component: <Knowledgebase />,
  },
  {
    type: "collapse",
    name: "FAQs",
    key: "faq",
    icon: "notifications",
    route: "/faq",
    component: <FAQ />,
  },
];

export default adminRoutes;
