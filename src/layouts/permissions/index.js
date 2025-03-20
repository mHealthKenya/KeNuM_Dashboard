// PermissionsView.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { getAllUsers } from "services/user/userService";

// Mock permissions data
const permissionsList = [
  { id: 1, name: "Create User" },
  { id: 2, name: "Edit User" },
  { id: 3, name: "Delete User" },
  { id: 4, name: "Create Post" },
  { id: 5, name: "Edit Post" },
  { id: 6, name: "Delete Post" },
];

export default function PermissionsView() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);

  // Use Material-UI's useTheme and useMediaQuery for responsiveness
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  // Handle opening the permissions modal
  const handleOpenPermissionsModal = (user) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setPermissionsModalOpen(true);
  };

  // Handle closing the permissions modal
  const handleClosePermissionsModal = () => {
    setPermissionsModalOpen(false);
    setSelectedUser(null);
    setSelectedPermissions([]);
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

  return (
    <Box
      sx={{
        p: isSmallScreen ? 2 : 4,
        ml: isSmallScreen ? 0 : "250px", // Adjust based on your sidebar width
        overflowX: "auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        User Permissions Management
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650, tableLayout: "fixed" }} aria-label="user permissions table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "20%" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "25%" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "15%" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "25%" }}>Permissions</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "15%" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ padding: "12px" }}>{`${user.f_name} ${user.l_name}`}</TableCell>
                <TableCell sx={{ padding: "12px" }}>{user.email}</TableCell>
                <TableCell sx={{ padding: "12px" }}>{user.role}</TableCell>
                <TableCell sx={{ padding: "12px" }}>
                  {user.permissions && user.permissions.length > 0
                    ? user.permissions
                        .map((permissionId) => {
                          const permission = permissionsList.find((p) => p.id === permissionId);
                          return permission ? permission.name : null;
                        })
                        .filter(Boolean)
                        .join(", ")
                    : "No permissions"}
                </TableCell>
                <TableCell sx={{ padding: "12px", textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenPermissionsModal(user)}
                    size="small"
                  >
                    <span style={{ color: "white" }}>Edit Permissions</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Permissions Modal */}
      <Modal open={permissionsModalOpen} onClose={handleClosePermissionsModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isSmallScreen ? "90%" : "400px",
            maxWidth: "90vw", // Ensure it fits within the screen
            bgcolor: "background.paper",
            boxShadow: 24,
            p: isSmallScreen ? 2 : 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Set Permissions for {selectedUser?.f_name} {selectedUser?.l_name}
          </Typography>
          {error && (
            <Typography color="error" gutterBottom>
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
              color="secondary"
              onClick={handleClosePermissionsModal}
              size={isSmallScreen ? "small" : "medium"}
            >
              <span style={{ color: "white" }}>Cancel</span>
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePermissions}
              disabled={loading}
              size={isSmallScreen ? "small" : "medium"}
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
    </Box>
  );
}
