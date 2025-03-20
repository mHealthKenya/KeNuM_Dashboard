import { useState } from "react";
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
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";

const roles = ["Admin", "NCK", "CNO", "Provider", "Facility"];
const permissions = [
  "Add User",
  "Delete User",
  "Edit User",
  "Create Event",
  "Update Event",
  "Create Supervisor",
  "Update Supervisor",
  "Delete Supervisor",
  "Add Facility",
  "Update Facility",
  "Delete Facility",
];

function Settings() {
  const [rolePermissions, setRolePermissions] = useState(
    roles.reduce((acc, role) => {
      acc[role] = {};
      permissions.forEach((perm) => (acc[role][perm] = false));
      return acc;
    }, {})
  );

  const handleCheckboxChange = (role, permission) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: { ...prev[role], [permission]: !prev[role][permission] },
    }));
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
              <MDBox p={2}>
                <TableContainer>
                  <Table sx={{ width: "100%", tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textAlign: "left",
                            width: "200px", // Fixed width for Role
                            p: 2,
                          }}
                        >
                          Role
                        </TableCell>
                        {permissions.map((perm) => (
                          <TableCell
                            key={perm}
                            sx={{
                              fontWeight: "bold",
                              textAlign: "center",
                              width: `${100 / permissions.length}%`, // Adjusted to include Role column
                              minWidth: "110px", // Prevents collapsing on small screens
                              p: 2,
                            }}
                          >
                            {perm}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role}>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              textAlign: "left",
                              width: "200px", // Same width as header
                              p: 2,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {role}
                          </TableCell>

                          {permissions.map((perm) => (
                            <TableCell
                              key={perm}
                              sx={{
                                textAlign: "center",
                                width: `${100 / permissions.length}%`, // Match header
                                p: 2,
                              }}
                            >
                              <Checkbox
                                checked={rolePermissions[role][perm]}
                                onChange={() => handleCheckboxChange(role, perm)}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <MDBox mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="contained" color="primary">
                    <span style={{ color: "white" }}>Save Changes</span>
                  </Button>
                </MDBox>
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
