import { useState } from "react";
import { addUser } from "services/user/userService";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

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
  "Facility Supervisor": "CNO",
  "Rotations Supervisor": "CNO",
};

function AddUser() {
  const [isSimpleForm, setIsSimpleForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAddUser = async () => {
    if (isSimpleForm) {
      if (!indexNumber || !role) {
        setMessage({ type: "error", text: "Please fill in all required fields." });
        return;
      }

      const newUser = {
        index_number: indexNumber,
        role: roleMapping[role],
      };

      console.log("Submitting Simple Form:", newUser);
    } else {
      if (!firstName || !lastName || !email || !phoneNumber || !role || !gender) {
        setMessage({ type: "error", text: "Please fill in all required fields." });
        return;
      }

      const newUser = {
        national_id: nationalID || null,
        f_name: firstName,
        l_name: lastName,
        email,
        phone_number: phoneNumber,
        role: roleMapping[role],
        gender,
      };

      console.log("Submitting Full Form:", newUser);
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await addUser(
        isSimpleForm
          ? { index_number: indexNumber, role: roleMapping[role] }
          : {
              national_id: nationalID || null,
              f_name: firstName,
              l_name: lastName,
              email,
              phone_number: phoneNumber,
              role: roleMapping[role],
              gender,
            }
      );

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
      setIndexNumber("");
    } catch (err) {
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
                      checked={isSimpleForm}
                      onChange={() => setIsSimpleForm(!isSimpleForm)}
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

                <Grid container spacing={2}>
                  {isSimpleForm ? (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          label="Index Number *"
                          fullWidth
                          value={indexNumber}
                          onChange={(e) => setIndexNumber(e.target.value)}
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
                    </>
                  ) : (
                    <>
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
                    </>
                  )}

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
