import { useState, useEffect } from "react";
import { getAllUsers } from "services/user/userService"; // Import API function
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { Button, Modal, TextField, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";

// Modal Style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function DataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users on component mount
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

  // Handle opening the edit modal
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  // Handle saving edited user details
  const handleSaveUser = async (updatedUser) => {
    setLoading(true);
    try {
      // Call your API to update the user
      // await updateUser(updatedUser.id, updatedUser);

      // Update the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user))
      );

      // Close the modal
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating user:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = (userId) => {
    console.log("Delete user:", userId);
    // Add logic for deleting user here
  };

  // Author component for displaying user details
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
          {/* Edit Button */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon sx={{ color: "white" }} />}
            onClick={() => handleOpenEditModal(user)}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <span style={{ color: "white" }}>edit</span>
            )}
          </Button>

          {/* Delete Button */}
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

    // Modal for editing user details
    modal: (
      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" mb={2}>
            Edit User
          </Typography>
          {selectedUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedUser = {
                  ...selectedUser,
                  f_name: e.target.f_name.value,
                  l_name: e.target.l_name.value,
                  email: e.target.email.value,
                  phone_number: e.target.phone_number.value,
                  role: e.target.role.value,
                };
                handleSaveUser(updatedUser);
              }}
            >
              <TextField
                fullWidth
                label="First Name"
                name="f_name"
                defaultValue={selectedUser.f_name}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="l_name"
                defaultValue={selectedUser.l_name}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                defaultValue={selectedUser.email}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                defaultValue={selectedUser.phone_number}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Role"
                name="role"
                defaultValue={selectedUser.role}
                margin="normal"
              />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": { backgroundColor: "#b71c1c" },
                  }}
                  onClick={handleCloseEditModal}
                >
                  <span style={{ color: "white" }}>Cancel</span>
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    "&:hover": { backgroundColor: "#1b5e20" },
                  }}
                >
                  <span style={{ color: "white" }}>Save</span>
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>
    ),
  };
}
