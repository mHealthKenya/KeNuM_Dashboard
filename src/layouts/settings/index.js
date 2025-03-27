"use client";

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import { addRole, getRoles, getRolesWithPermissions } from "services/roles/rolesService";
import { addPermission, getPermissions } from "services/permissions/permissionsService";

function Settings() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolesWithPermissions, setRolesWithPermissions] = useState([]); // New state for roles with permissions
  const [rolePermissions, setRolePermissions] = useState({});
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState("");
  const [newRoleName, setNewRoleName] = useState(""); // Added state for new role name
  const [loading, setLoading] = useState({
    roles: false,
    permissions: false,
    rolesWithPermissions: false, // New loading state
    role: false,
    permission: false,
  });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({
          ...prev,
          roles: true,
          permissions: true,
          rolesWithPermissions: true, // Set loading for new data
        }));

        // Fetch roles and permissions in parallel
        const [rolesResponse, permissionsResponse, rolesWithPermissionsResponse] =
          await Promise.all([
            getRoles(),
            getPermissions(),
            getRolesWithPermissions(), // Fetch roles with permissions
          ]);

        setRoles(rolesResponse.data || rolesResponse);
        setPermissions(permissionsResponse.data || permissionsResponse);
        setRolesWithPermissions(rolesWithPermissionsResponse || []); // Set the fetched data
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to load data");
      } finally {
        setLoading((prev) => ({
          ...prev,
          roles: false,
          permissions: false,
          rolesWithPermissions: false,
        }));
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveRole = async () => {
    if (!roleName.trim()) {
      alert("Please enter a role name");
      return;
    }
    if (selectedPermissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }

    setLoading((prev) => ({ ...prev, role: true }));
    try {
      await addRole({
        name: roleName,
        permissions: selectedPermissions.map((perm) =>
          typeof perm === "object" && perm.name ? perm.name : perm
        ),
      });

      // Refresh roles after adding new one
      const [rolesResponse, rolesWithPermissionsResponse] = await Promise.all([
        getRoles(),
        getRolesWithPermissions(), // Refresh roles with permissions too
      ]);

      setRoles(rolesResponse.data || rolesResponse);
      setRolesWithPermissions(rolesWithPermissionsResponse || []);

      setRoleName("");
      setSelectedPermissions([]);
      alert("Role added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add role");
    } finally {
      setLoading((prev) => ({ ...prev, role: false }));
    }
  };

  const handleAddPermission = async () => {
    if (!newPermission.trim()) {
      alert("Please enter a permission name");
      return;
    }

    setLoading((prev) => ({ ...prev, permission: true }));
    try {
      await addPermission({ name: newPermission });
      const response = await getPermissions();
      setPermissions(response.data || response);
      setNewPermission("");
      alert("Permission added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add permission");
    } finally {
      setLoading((prev) => ({ ...prev, permission: false }));
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      alert("Please enter a role name");
      return;
    }

    setLoading((prev) => ({ ...prev, role: true }));
    try {
      await addRole({
        name: newRoleName,
        permissions: [], // Adding role without permissions initially
      });

      // Refresh roles after adding new one
      const [rolesResponse, rolesWithPermissionsResponse] = await Promise.all([
        getRoles(),
        getRolesWithPermissions(),
      ]);

      setRoles(rolesResponse.data || rolesResponse);
      setRolesWithPermissions(rolesWithPermissionsResponse || []);

      setNewRoleName("");
      alert("Role added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add role");
    } finally {
      setLoading((prev) => ({ ...prev, role: false }));
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Card sx={{ width: "100%", overflowX: "auto", p: 3 }}>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Roles & Permissions
                </MDTypography>
              </MDBox>

              <MDBox sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Manage Roles/Permissions" />
                  <Tab label="List" />
                </Tabs>
              </MDBox>

              <MDBox p={2}>
                {tabValue === 0 ? (
                  <MDBox>
                    <MDTypography variant="h6" gutterBottom>
                      Manage permissions/Roles
                    </MDTypography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Role Name</InputLabel>
                      <Select
                        label="Role Name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        sx={{
                          height: 56,
                          fontSize: 16,
                          "& .MuiSelect-select": {
                            padding: "10px 14px",
                            minHeight: "auto !important",
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              "& .MuiMenuItem-root": {
                                fontSize: 16,
                                padding: "8px 16px",
                              },
                            },
                          },
                        }}
                      >
                        {loading.roles ? (
                          <MenuItem disabled>
                            <CircularProgress size={24} />
                          </MenuItem>
                        ) : (
                          roles.map((role) => (
                            <MenuItem
                              key={role.id || role}
                              value={role.name || role}
                              sx={{ fontSize: 16 }}
                            >
                              {role.name || role}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Permissions</InputLabel>
                        <Select
                          multiple
                          label="Permissions"
                          value={selectedPermissions}
                          onChange={(e) => setSelectedPermissions(e.target.value)}
                          renderValue={(selected) => selected.join(", ")}
                          sx={{
                            height: 56,
                            fontSize: 16,
                            "& .MuiSelect-select": {
                              padding: "10px 14px",
                              minHeight: "auto !important",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: 300,
                                "& .MuiMenuItem-root": {
                                  fontSize: 16,
                                  padding: "8px 16px",
                                },
                              },
                            },
                          }}
                        >
                          {loading.permissions ? (
                            <MenuItem disabled>
                              <CircularProgress size={24} />
                            </MenuItem>
                          ) : (
                            permissions.map((perm) => (
                              <MenuItem
                                key={perm.id || perm}
                                value={perm.name || perm}
                                sx={{ fontSize: 16 }}
                              >
                                <Checkbox
                                  checked={selectedPermissions.includes(perm.name || perm)}
                                  sx={{ padding: "4px 8px" }}
                                />
                                {perm.name || perm}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Button
                      variant="contained"
                      onClick={handleSaveRole}
                      disabled={loading.role}
                      sx={{ mb: 4 }}
                    >
                      {loading.role ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        <span style={{ color: "white" }}>Save Role</span>
                      )}
                    </Button>

                    <Divider sx={{ my: 3 }} />

                    <MDTypography variant="h6" gutterBottom>
                      Add New Permission
                    </MDTypography>
                    <TextField
                      fullWidth
                      label="Permission Name"
                      value={newPermission}
                      onChange={(e) => setNewPermission(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddPermission}
                      disabled={loading.permission}
                    >
                      {loading.permission ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        <span style={{ color: "white" }}>Add Permission</span>
                      )}
                    </Button>

                    <Divider sx={{ my: 3 }} />

                    <MDTypography variant="h6" gutterBottom>
                      Add Role
                    </MDTypography>
                    <TextField
                      fullWidth
                      label="Role Name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={handleAddRole} disabled={loading.role}>
                      {loading.role ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        <span style={{ color: "white" }}>Add Role</span>
                      )}
                    </Button>
                  </MDBox>
                ) : (
                  <MDBox>
                    <MDTypography variant="h6" gutterBottom>
                      Roles
                    </MDTypography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", width: "30%" }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Permissions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading.rolesWithPermissions ? (
                            <TableRow>
                              <TableCell colSpan={2} align="center">
                                <CircularProgress />
                              </TableCell>
                            </TableRow>
                          ) : (
                            rolesWithPermissions.map((role) => (
                              <TableRow key={role.id || role}>
                                <TableCell>{role.name || role}</TableCell>
                                <TableCell>
                                  {role.permissions
                                    ? Array.isArray(role.permissions)
                                      ? role.permissions
                                          .map((perm) =>
                                            typeof perm === "object" && perm.name ? perm.name : perm
                                          )
                                          .join(", ")
                                      : "No permissions assigned"
                                    : "No permissions assigned"}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <MDTypography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Permissions
                    </MDTypography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Permission</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading.permissions ? (
                            <TableRow>
                              <TableCell colSpan={1} align="center">
                                <CircularProgress />
                              </TableCell>
                            </TableRow>
                          ) : (
                            permissions.map((perm) => (
                              <TableRow key={perm.id || perm}>
                                <TableCell>{perm.name || perm}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Settings;
