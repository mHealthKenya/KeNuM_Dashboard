import { useState, useEffect } from "react";
import { getAllUsers, updateUser } from "services/user/userService";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

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

// Mock permissions data
const permissionsList = [
  { id: 1, name: "Create User" },
  { id: 2, name: "Edit User" },
  { id: 3, name: "Delete User" },
  { id: 4, name: "Create Post" },
  { id: 5, name: "Edit Post" },
  { id: 6, name: "Delete Post" },
];

// Mock updateUserPermissions function
const updateUserPermissions = async (userId, permissions) => {
  // Simulate an API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        permissions: permissions, // Return the updated permissions
      });
    }, 1000); // Simulate a 1-second delay
  });
};

export default function DataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const navigate = useNavigate();

  const handleOpenPermissionsView = (userId) => {
    navigate("/permissions");
  };

  // Initialize formData state
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone_number: "",
    role: "",
  });

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

  // Update formData when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        f_name: selectedUser.f_name || "",
        l_name: selectedUser.l_name || "",
        email: selectedUser.email || "",
        phone_number: selectedUser.phone_number || "",
        role: selectedUser.role || "",
      });
      setSelectedPermissions(selectedUser.permissions || []); // Initialize permissions
    }
  }, [selectedUser]);

  // Handle opening the edit modal
  const handleOpenEditModal = (user) => {
    console.log("Opening Edit Modal for user:", user);
    setSelectedUser(user);
    setEditModalOpen(true);
    setError(null);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    console.log("Closing Edit Modal");
    setEditModalOpen(false);
    setSelectedUser(null);
    setFormData({
      f_name: "",
      l_name: "",
      email: "",
      phone_number: "",
      role: "",
    });
    setError(null); // Clear any errors
  };

  // Handle opening the permissions modal
  const handleOpenPermissionsModal = (user) => {
    console.log("Opening Permissions Modal for user:", user); // Debug log
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []); // Initialize permissions
    setPermissionsModalOpen(true); // Open the modal
    setEditModalOpen(false); // Close the edit modal if it's open
  };

  // Handle closing the permissions modal
  const handleClosePermissionsModal = () => {
    console.log("Closing Permissions Modal"); // Debug log
    setPermissionsModalOpen(false);
    setSelectedUser(null);
    setSelectedPermissions([]); // Reset permissions
  };

  // Handle saving edited user details
  const handleSaveUser = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Call the updateUser service
      const updatedUser = await updateUser(selectedUser.id, formData);

      // Update the UI state with the updated user data
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...updatedUser } : user))
      );

      // Close the modal
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating user:", error.message);
      setError(error.message); // Set the error message
    } finally {
      setLoading(false);
    }
  };

  // Handle saving user permissions
  const handleSavePermissions = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Call the mock updateUserPermissions function
      const updatedUser = await updateUserPermissions(selectedUser.id, selectedPermissions);

      // Update the UI state with the updated user data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, permissions: updatedUser.permissions } : user
        )
      );

      // Close the modal
      handleClosePermissionsModal();
    } catch (error) {
      console.error("Error updating permissions:", error.message);
      setError(error.message); // Set the error message
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions(
      (prev) =>
        prev.includes(permissionId)
          ? prev.filter((id) => id !== permissionId) // Remove permission
          : [...prev, permissionId] // Add permission
    );
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
            startIcon={<EditIcon sx={{ color: "#FEFEFE" }} />}
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

          {/* Permissions Button */}
          {/* <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<EditIcon sx={{ color: "#FEFEFE" }} />}
            // onClick={() => handleOpenPermissionsModal(user)}

            onClick={() => handleOpenPermissionsView(user.id)}
          >
            <span style={{ color: "white" }}>Permissions</span>
          </Button> */}
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
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}
          {selectedUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveUser();
              }}
            >
              <TextField
                fullWidth
                label="First Name"
                name="f_name"
                value={formData.f_name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="l_name"
                value={formData.l_name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                margin="normal"
              />
              <FormControl fullWidth margin="normal" sx={{ minHeight: 56 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  sx={{ height: 40 }}
                  onChange={handleChange}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="CNO">CNO</MenuItem>
                  <MenuItem value="Provider">Provider</MenuItem>
                </Select>
              </FormControl>
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
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    <span style={{ color: "white" }}>Save</span>
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>
    ),

    // Modal for setting user permissions
    permissionsModal: (
      <Modal open={permissionsModalOpen} onClose={handleClosePermissionsModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" mb={2}>
            Set Permissions for {selectedUser?.f_name} {selectedUser?.l_name}
          </Typography>
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}
          <List>
            {permissionsList.map((permission) => (
              <ListItem key={permission.id}>
                <Checkbox
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={() => handlePermissionChange(permission.id)}
                />
                <ListItemText primary={permission.name} />
              </ListItem>
            ))}
          </List>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
              onClick={handleClosePermissionsModal}
            >
              <span style={{ color: "white" }}>Cancel</span>
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "#1b5e20" },
              }}
              onClick={handleSavePermissions}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                <span style={{ color: "white" }}>Save</span>
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    ),
  };
}
