import { useState, useEffect } from "react";
import { getAllUsers, updateUser } from "services/user/userService";
import { getRoles } from "services/roles/rolesService";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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

  // State for roles from API
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState("");
  const [roleIdRequired, setRoleIdRequired] = useState(false);

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
    roleId: "", // Changed from roles to roleId
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        console.log("Fetched users:", usersData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  // Fetch roles when component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        const rolesData = await getRoles();
        console.log("Fetched roles:", rolesData);
        setRoles(rolesData);
        setRolesError("");
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        setRolesError("Failed to load roles. Please try again later.");
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Update formData when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      console.log("Selected user for editing:", selectedUser);

      // Determine the roleId from the user's roles
      let roleId = "";

      if (Array.isArray(selectedUser.roles) && selectedUser.roles.length > 0) {
        const role = selectedUser.roles[0];
        roleId = role.id || role._id || "";
        console.log("Found roleId from roles array:", roleId);
      } else if (selectedUser.role) {
        roleId = selectedUser.role.id || selectedUser.role._id || "";
        console.log("Found roleId from role object:", roleId);
      }

      // If we still don't have a roleId and we have roles available, use the first one
      if (!roleId && roles.length > 0) {
        roleId = roles[0].id || roles[0]._id || "";
        console.log("Using default roleId from roles list:", roleId);
      }

      setFormData({
        id: String(selectedUser.id),
        f_name: selectedUser.f_name || "",
        l_name: selectedUser.l_name || "",
        email: selectedUser.email || "",
        phone_number: selectedUser.phone_number || "",
        roleId: roleId,
      });

      setRoleIdRequired(false);
    }
  }, [selectedUser, roles]);

  // Handle opening the edit modal
  const handleOpenEditModal = (user) => {
    console.log("Opening Edit Modal for user:", user);
    setSelectedUser(user);
    setEditModalOpen(true);
    setError(null);
    setRoleIdRequired(false);
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
      roleId: "",
    });
    setError(null); // Clear any errors
    setRoleIdRequired(false);
  };

  // Handle opening the permissions modal
  const handleOpenPermissionsModal = (user) => {
    console.log("Opening Permissions Modal for user:", user);
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setPermissionsModalOpen(true);
    setEditModalOpen(false);
  };

  // Handle closing the permissions modal
  const handleClosePermissionsModal = () => {
    console.log("Closing Permissions Modal");
    setPermissionsModalOpen(false);
    setSelectedUser(null);
    setSelectedPermissions([]);
  };

  // Update the handleSaveUser function to use the correct format for roles
  const handleSaveUser = async () => {
    try {
      // Validate role selection
      if (!formData.roleId) {
        setRoleIdRequired(true);
        return;
      }

      setLoading(true);

      if (!formData.id) {
        throw new Error("User ID is missing.");
      }

      // Format the data correctly for the API
      const userData = {
        f_name: formData.f_name,
        l_name: formData.l_name,
        email: formData.email,
        phone_number: formData.phone_number,
        // Use the roles field with the correct format for connecting roles
        roles: {
          set: [], // Clear existing roles
          connect: [{ id: formData.roleId }], // Connect the selected role
        },
      };

      console.log("Updating user with ID:", formData.id, "and data:", userData);

      const response = await updateUser(formData.id, userData);

      if (response?.success) {
        // Update the local users state to reflect the changes
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === formData.id
              ? {
                  ...user,
                  f_name: formData.f_name,
                  l_name: formData.l_name,
                  email: formData.email,
                  phone_number: formData.phone_number,
                  // Update the role based on the selected roleId
                  roles: [roles.find((r) => (r.id || r._id) === formData.roleId) || user.roles[0]],
                }
              : user
          )
        );

        handleCloseEditModal();
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update user. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle saving user permissions
  const handleSavePermissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserPermissions(selectedUser.id, selectedPermissions);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, permissions: updatedUser.permissions } : user
        )
      );

      handleClosePermissionsModal();
    } catch (error) {
      console.error("Error updating permissions:", error.message);
      setError(error.message);
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

    // Clear roleId required error when a role is selected
    if (name === "roleId" && value) {
      setRoleIdRequired(false);
    }
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
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
          {Array.isArray(user.roles)
            ? user.roles.map((r) => r.name || r.display_name || r.title).join(", ")
            : user.role?.name ?? user.role ?? "No role"}
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
            {loading && selectedUser?.id === user.id ? (
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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {rolesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {rolesError}
            </Alert>
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
                autoFocus
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
              <FormControl fullWidth margin="normal" sx={{ minHeight: 56 }} error={roleIdRequired}>
                <InputLabel>Role *</InputLabel>
                <Select
                  name="roleId"
                  value={formData.roleId || ""}
                  sx={{ height: 40 }}
                  onChange={handleChange}
                  disabled={rolesLoading}
                  required
                >
                  {rolesLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading roles...
                    </MenuItem>
                  ) : roles.length > 0 ? (
                    roles.map((roleOption) => (
                      <MenuItem
                        key={roleOption.id || roleOption._id}
                        value={roleOption.id || roleOption._id}
                        sx={{ fontSize: 16 }}
                      >
                        {roleOption.display_name ||
                          roleOption.name ||
                          roleOption.title ||
                          JSON.stringify(roleOption)}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No roles available</MenuItem>
                  )}
                </Select>
                {roleIdRequired && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>
                    Role is required
                  </Typography>
                )}
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
                  disabled={loading || rolesLoading}
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
  };
}
