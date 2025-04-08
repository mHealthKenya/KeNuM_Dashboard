"use client";

import { useState, useEffect } from "react";
import { addUser } from "services/user/userService";
import { getRoles } from "services/roles/rolesService";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function AddUser() {
  const [isNurse, setIsNurse] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // State for roles from API
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState("");

  // Fetch roles when component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        const rolesData = await getRoles();
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

  // Debug roles data
  useEffect(() => {
    if (roles.length > 0) {
      console.log("Fetched roles:", roles);
    }
  }, [roles]);

  const handleAddUser = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !role || !gender) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const userData = {
        national_id: nationalID || null,
        f_name: firstName,
        l_name: lastName,
        email,
        phone_number: phoneNumber,
        roleId: role, // Send the role ID directly
        gender,
        isNurse, // Add isNurse flag
      };

      console.log("Submitting User Data:", userData);

      const response = await addUser(userData);

      console.log("Server Response:", response);
      setMessage({ type: "success", text: "User successfully added!" });

      // Reset fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setNationalID("");
      setRole("");
      setGender("");
      // Don't reset isNurse to maintain the toggle state
    } catch (err) {
      console.error("Error adding user:", err);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card>
              <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h5">Add New User</MDTypography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isNurse}
                      onChange={() => setIsNurse(!isNurse)}
                      color="primary"
                    />
                  }
                  label="Is Nurse"
                />
              </MDBox>

              <MDBox p={3}>
                {message.text && (
                  <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                  </Alert>
                )}

                {rolesError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {rolesError}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="First Name *"
                      fullWidth
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Last Name *"
                      fullWidth
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email *"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone Number *"
                      type="tel"
                      fullWidth
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="National ID (Optional)"
                      type="tel"
                      fullWidth
                      value={nationalID}
                      onChange={(e) => setNationalID(e.target.value.replace(/\D/g, ""))}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Role *"
                      fullWidth
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      sx={{ height: 56 }}
                      SelectProps={{
                        sx: { height: 56, fontSize: 16, padding: "10px" },
                      }}
                      disabled={rolesLoading}
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
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Gender *"
                      fullWidth
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      sx={{ height: 56 }}
                      SelectProps={{
                        sx: { height: 56, fontSize: 16, padding: "10px" },
                      }}
                    >
                      <MenuItem value="Male" sx={{ fontSize: 16 }}>
                        Male
                      </MenuItem>
                      <MenuItem value="Female" sx={{ fontSize: 16 }}>
                        Female
                      </MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddUser}
                      fullWidth
                      disabled={loading || rolesLoading}
                      style={{ color: "white" }}
                    >
                      {loading ? "Adding..." : "Add User"}
                    </Button>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AddUser;
