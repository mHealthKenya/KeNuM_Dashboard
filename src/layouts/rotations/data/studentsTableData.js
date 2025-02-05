/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function data() {
  const Name = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  const createRow = (name, contact, competency, rotations, facility, tasks) => ({
    name: <Name name={name} />,
    contact: <Job title={contact} />,
    competency: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {competency}
      </MDTypography>
    ),
    rotations: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {rotations}
      </MDTypography>
    ),
    facility: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {facility}
      </MDTypography>
    ),
    action: (
      <MDButton color="success" variant="contained">
        Approve
      </MDButton>
    ),
    details: (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} />
        <AccordionDetails>
          <MDBox>
            <MDTypography variant="caption" color="text" fontWeight="medium">
              Tasks Done:
            </MDTypography>
            <ul>
              {tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </MDBox>
        </AccordionDetails>
      </Accordion>
    ),
  });

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "15%", align: "left" },
      { Header: "Contact", accessor: "contact", align: "left" },
      { Header: "Competency", accessor: "competency", align: "center" },
      { Header: "Weeks", accessor: "rotations", align: "center" },
      { Header: "Facility", accessor: "facility", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
      { Header: "Details", accessor: "details", align: "center" },
    ],

    rows: [
      createRow("Peter Kamau", "+254878876662", "General Nursing", "12 Weeks", "Facility A", [
        "Completed onboarding tasks",
        "Attended team training sessions",
        "Assisted in project A development",
        "Reviewed task B deliverables",
      ]),
      createRow("Peris Wairimu", "+254878876662", "Mental Health", "23 Weeks", "Facility B", [
        "Lead sprint planning sessions",
        "Coordinated with external partners",
        "Completed task C milestones",
        "Reviewed codebase for quality",
      ]),
      createRow("Ann Moraa", "+254878876662", "Communnity Service", "03 Weeks", "Facility C", [
        "Performed system diagnostics",
        "Documented process improvements",
        "Prepared reports for review",
        "Worked on client feedback integration",
      ]),
      createRow("John Doe", "+254712345678", "Casualty/OPD", "15 Weeks", "Facility D", [
        "Implemented security updates",
        "Led daily stand-up meetings",
        "Managed database migrations",
        "Reviewed and approved feature requests",
      ]),
      createRow("Jane Smith", "+254789456123", "Medical nursing", "08 Weeks", "Facility E", [
        "Conducted user interviews",
        "Created wireframes and prototypes",
        "Tested new application features",
        "Managed project timelines",
      ]),
      createRow("Michael Otieno", "+254711223344", "Pediatrics nursing", "18 Weeks", "Facility F", [
        "Designed cloud architecture",
        "Optimized application performance",
        "Automated deployment pipelines",
        "Collaborated on machine learning models",
      ]),
      createRow("Alice Njeri", "+254733445566", "Surgical nursing", "20 Weeks", "Facility G", [
        "Handled customer service issues",
        "Managed IT support tickets",
        "Led cybersecurity awareness training",
        "Documented best practices",
      ]),
      createRow("Kevin Kiptoo", "+254755667788", "Theatre nursing", "10 Weeks", "Facility H", [
        "Built RESTful APIs",
        "Integrated third-party services",
        "Refactored legacy code",
        "Optimized SQL queries",
      ]),
      createRow("Brenda Kendi", "+254799887766", "Mental Health", "14 Weeks", "Facility I", [
        "Organized training workshops",
        "Developed mentorship programs",
        "Handled HR compliance documentation",
        "Resolved team conflicts",
      ]),
    ],
  };
}
