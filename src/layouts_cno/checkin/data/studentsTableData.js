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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function data() {
  const Name = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "name", accessor: "name", width: "30%", align: "left" },
      { Header: "contact", accessor: "contact", align: "left" },
      { Header: "rotations", accessor: "rotations", align: "center" },
      { Header: "Facility", accessor: "facility", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
      { Header: "details", accessor: "details", align: "center" }, // Add an additional column for accordion
    ],

    rows: [
      {
        name: <Name name="Peter Kamau" />,
        contact: <Job title="+254878876662" />,
        rotations: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            12 Weeks
          </MDTypography>
        ),
        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility A
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
        details: (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            />
            <AccordionDetails>
              <MDBox>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  Tasks Done:
                </MDTypography>
                <ul>
                  <li>Completed onboarding tasks</li>
                  <li>Attended team training sessions</li>
                  <li>Assisted in project A development</li>
                  <li>Reviewed task B deliverables</li>
                </ul>
              </MDBox>
            </AccordionDetails>
          </Accordion>
        ),
      },
      {
        name: <Name name="Peris Wairimu" />,
        contact: <Job title="+254878876662" />,
        rotations: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            23 Weeks
          </MDTypography>
        ),
        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility B
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
        details: (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            />
            <AccordionDetails>
              <MDBox>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  Tasks Done:
                </MDTypography>
                <ul>
                  <li>Lead sprint planning sessions</li>
                  <li>Coordinated with external partners</li>
                  <li>Completed task C milestones</li>
                  <li>Reviewed codebase for quality</li>
                </ul>
              </MDBox>
            </AccordionDetails>
          </Accordion>
        ),
      },
      {
        name: <Name name="Ann Moraa" />,
        contact: <Job title="+254878876662" />,
        rotations: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            03 Weeks
          </MDTypography>
        ),
        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility C
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
        details: (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            />
            <AccordionDetails>
              <MDBox>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  Tasks Done:
                </MDTypography>
                <ul>
                  <li>Performed system diagnostics</li>
                  <li>Documented process improvements</li>
                  <li>Prepared reports for review</li>
                  <li>Worked on client feedback integration</li>
                </ul>
              </MDBox>
            </AccordionDetails>
          </Accordion>
        ),
      },
      // Repeat for other rows...
    ],
  };
}
