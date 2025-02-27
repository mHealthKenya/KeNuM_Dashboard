import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function AddUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");

  const handleAddUser = () => {
    if (firstName && lastName && email && phoneNumber && role && gender) {
      const newUser = {
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        gender,
      };
      console.log("User added:", newUser);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setRole("");
      setGender("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" mb={2}>
                  Add New User
                </MDTypography>
                <MDTypography variant="h8" mb={2}>
                  All fields marked with * are required fields
                </MDTypography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="First Name"
                      fullWidth
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone Number"
                      type="tel"
                      fullWidth
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Role"
                      fullWidth
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      InputLabelProps={{
                        style: { fontSize: "16px" },
                      }}
                      InputProps={{
                        style: { height: "56px", padding: "0 14px" },
                      }}
                    >
                      <MenuItem value="NCK Admin">NCK Admin</MenuItem>
                      <MenuItem value="CPD Provider">CPD Provider</MenuItem>
                      <MenuItem value="Internship Coordinator">Internship Coordinator</MenuItem>
                      <MenuItem value="Facility Supervisor">Facility Supervisor</MenuItem>
                      <MenuItem value="Rotation Supervisor">Rotations Supervisor</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Gender"
                      fullWidth
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      InputLabelProps={{
                        style: { fontSize: "16px" },
                      }}
                      InputProps={{
                        style: { height: "56px", padding: "0 14px" },
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddUser}
                      fullWidth
                      style={{ color: "white" }}
                    >
                      Add User
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
