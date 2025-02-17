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
      { Header: "Facility", accessor: "facility", align: "center" },
      { Header: "county", accessor: "county", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        name: <Name name="John Mureithi" />,
        contact: <Job title="+254878876662" />,

        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility A
          </MDTypography>
        ),
        county: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Mombasa
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      // {
      //   name: <Name image={team3} name="Alex Cheruto" />,
      //   contact: <Job title="+254878876662" />,

      //   facility: (
      //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      //       Facility B
      //     </MDTypography>
      //   ),
      //   county: (
      //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      //       Kwale
      //     </MDTypography>
      //   ),
      //   action: (
      //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      //       Edit
      //     </MDTypography>
      //   ),
      // },
      {
        name: <Name name="Alex Cheruto" />,
        contact: <Job title="+254878876662" />,

        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility B
          </MDTypography>
        ),
        county: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Kwale
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        name: <Name name="Lauren Cherop" />,
        contact: <Job title="+254878876662" />,

        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility C
          </MDTypography>
        ),
        county: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Sugoi
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        name: <Name name="Michael Omwami" />,
        contact: <Job title="+254878876662" />,

        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility D
          </MDTypography>
        ),
        county: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Moyale
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        name: <Name name="Richard Ochieng" />,
        contact: <Job title="+254878876662" />,

        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility E
          </MDTypography>
        ),
        county: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Homa Bay
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        name: <Name name="Miriam Wairimu" />,
        contact: <Job title="+254878876662" />,

        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility F
          </MDTypography>
        ),
        county: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Kajiado
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        name: <Name name="John Kyalo" />,
        contact: <Job title="+254878876662" />,

        facility: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Facility G
          </MDTypography>
        ),
        county: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Mwingi
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
