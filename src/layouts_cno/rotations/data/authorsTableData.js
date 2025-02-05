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
import { Name } from "ajv";

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
      { Header: "status", accessor: "status", align: "center" },
      { Header: "Facility", accessor: "facility", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        name: <Name image={team2} name="John Michael" email="john@creative-tim.com" />,
        contact: <Job title="+254878876662" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
          </MDBox>
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
      },
      {
        name: <Name image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
        contact: <Job title="+254878876662" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="inactive" color="dark" variant="gradient" size="sm" />
          </MDBox>
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
      },
      {
        name: <Name image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
        contact: <Job title="+254878876662" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
          </MDBox>
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
      },
      {
        name: <Name image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
        contact: <Job title="+254878876662" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility D
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        name: <Name image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
        contact: <Job title="+254878876662" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="inactive" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility E
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        name: <Name image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
        contact: <Job title="+254878876662" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="inactive" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility F
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        name: <Name image={team2} name="John Michael" email="john@creative-tim.com" />,
        contact: <Job title="+254878876662" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility G
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
