// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import PropTypes from "prop-types"; // Import PropTypes

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

  // Define PropTypes for Author component
  Author.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  return {
    columns: [
      { Header: "name", accessor: "author", width: "30%", align: "left" },
      { Header: "contact", accessor: "contact", align: "left" },
      { Header: "role", accessor: "role", align: "left" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
        role: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Admin
          </MDTypography>
        ),
        contact: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +254724787765
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
        role: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Developer
          </MDTypography>
        ),
        contact: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +254767778876
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
        role: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Coordinator
          </MDTypography>
        ),
        contact: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +254798887726
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        author: <Author image={team2} name="Richard Gran" email="john@creative-tim.com" />,
        role: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Admin
          </MDTypography>
        ),
        contact: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +254798887726
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        author: <Author image={team3} name="Miriam Eric" email="alexa@creative-tim.com" />,
        role: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Developer
          </MDTypography>
        ),
        contact: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +254798887726
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      // Additional rows as needed...
    ],
  };
}
