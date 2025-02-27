import { useState } from "react";
import { addUser } from "services/user/userService";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Role Mapping for API
const roleMapping = {
  "NCK Admin": "NCK",
  "CPD Provider": "Provider",
  "Internship Coordinator": "CNO",
  // "Facility Supervisor": "FACILITY_SUPERVISOR",
  // "Rotations Supervisor": "ROTATIONS_SUPERVISOR",
  "Facility Supervisor": "CNO",
  "Rotations Supervisor": "CNO",
};

function AddUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalID, setNationalID] = useState(""); // Optional field
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAddUser = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !role || !gender) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const newUser = {
        national_id: nationalID || null, // Optional
        f_name: firstName,
        l_name: lastName,
        email,
        phone_number: phoneNumber,
        role: roleMapping[role], // Convert role to API expected format
        gender,
      };

      const response = await addUser(newUser);

      console.log("Server Response:", response);

      setMessage({ type: "success", text: "User successfully added!" });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setNationalID("");
      setRole("");
      setGender("");
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";

      if (err.message.includes("400")) {
        errorMessage = "Invalid input. Please check your details.";
      } else if (err.message.includes("401")) {
        errorMessage = "Unauthorized! Please log in again.";
      } else if (err.message.includes("403")) {
        errorMessage = "You do not have permission to perform this action.";
      } else if (err.message.includes("500")) {
        errorMessage = "Server error! Please try again later.";
      } else {
        errorMessage = err.message;
      }

      setMessage({ type: "error", text: errorMessage });
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
              <MDBox p={3}>
                <MDTypography variant="h5" mb={2}>
                  Add New User
                </MDTypography>
                <MDTypography variant="h8" mb={2}>
                  All fields marked with * are required fields
                </MDTypography>

                {message.text && (
                  <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
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
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        setPhoneNumber(value);
                      }}
                      inputProps={{ maxLength: 15 }} // Limit phone number length
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="National ID (Optional)"
                      type="tel"
                      fullWidth
                      value={nationalID}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        setNationalID(value);
                      }}
                      inputProps={{ maxLength: 15 }} // Limit ID length
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Role *"
                      fullWidth
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      sx={{ height: 56 }} // Increase dropdown size
                      SelectProps={{
                        sx: { height: 56, fontSize: 16, padding: "10px" }, // Increase font and padding
                      }}
                    >
                      {Object.keys(roleMapping).map((key) => (
                        <MenuItem key={key} value={key} sx={{ fontSize: 16 }}>
                          {key}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Gender *"
                      fullWidth
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      sx={{ height: 56 }} // Increase dropdown size
                      SelectProps={{
                        sx: { height: 56, fontSize: 16, padding: "10px" }, // Increase font and padding
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
                      disabled={loading}
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
