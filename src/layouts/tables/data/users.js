import { useState, useEffect } from "react";
import { getAllUsers } from "services/user/userService"; // Import API function
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";

export default function DataTable() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    console.log("Delete user:", userId);
    // Add logic for deleting user here
  };

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  // Define PropTypes
  Author.propTypes = {
    image: PropTypes.string,
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

    rows: users.map((user) => ({
      author: (
        <Author
          image={user.profileImage}
          name={`${user.f_name} ${user.l_name}`}
          email={user.email}
        />
      ),
      role: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.role}
        </MDTypography>
      ),
      contact: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.phone_number}
        </MDTypography>
      ),
      action: (
        <MDBox display="flex" alignItems="center" gap={1}>
          {/* Edit Button with Text */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon sx={{ color: "white" }} />}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <span style={{ color: "white" }}>edit</span>
            )}
          </Button>

          {/* Delete Button with Text */}
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteUser(user.id)}
          >
            Delete
          </Button>
        </MDBox>
      ),
    })),
  };
}
