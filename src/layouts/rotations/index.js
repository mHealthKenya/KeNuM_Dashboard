// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/rotations/data/authorsTableData";
import checkInReportsData from "layouts/rotations/data/checkInReportsData";
import studentsTableData from "layouts/rotations/data/studentsTableData";

// Import useState hook
import React, { useState } from "react";

function Tables() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState(0);

  // Get data for authors and students
  const { columns: authorsColumns, rows: authorsRows } = authorsTableData();
  const { columns: studentsColumns, rows: studentsRows } = studentsTableData();
  const {
    columns: checkInColumns,
    rows: checkInRows,
    downloadCSV,
    printPDF,
  } = checkInReportsData();

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {/* Tabs for switching between Authors and Students data */}
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Supervisors" />
              <Tab label="Students" />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            {/* Conditionally render data based on active tab */}
            <Card>
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
                  {activeTab === 0 ? "Supervisors List" : "Students List"}
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: activeTab === 0 ? authorsColumns : studentsColumns,
                    rows: activeTab === 0 ? authorsRows : studentsRows,
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
