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
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function data() {
  const Author = ({ image, name, email }) => (
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
      { Header: "coordinator", accessor: "coordinator", width: "45%", align: "left" },
      { Header: "location", accessor: "location", align: "left" },
      { Header: "participants", accessor: "participants", align: "center" },
      { Header: "Code", accessor: "code", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        coordinator: <Author name="John Michael" email="john@nck.com" />,
        function: <Job title="Manager" description="Organization" />,
        participants: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            300
          </MDTypography>
        ),
        code: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            HG77W
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        coordinator: <Author name="Alexa Liras" email="alexa@nck.com" />,
        function: <Job title="Programator" description="Developer" />,
        participants: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            109
          </MDTypography>
        ),
        code: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            JK8H2
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        coordinator: <Author name="Pamela Culoba" email="alexa@nck.com" />,
        function: <Job title="Executive" description="Projects" />,
        participants: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            876
          </MDTypography>
        ),
        code: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            K778A
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        coordinator: <Author name="Michael Levi" email="michael@nck.com" />,
        function: <Job title="Programator" description="Developer" />,
        participants: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            789
          </MDTypography>
        ),
        code: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            76H6F
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        coordinator: <Author name="Richard Gran" email="richard@nck.com" />,
        function: <Job title="Manager" description="Executive" />,
        participants: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2876
          </MDTypography>
        ),
        code: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            K76T9
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        coordinator: <Author name="Miriam Eric" email="miriam@nck.com" />,
        function: <Job title="Programator" description="Developer" />,
        participants: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            230
          </MDTypography>
        ),
        code: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J768H
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
    ],
  };
}
