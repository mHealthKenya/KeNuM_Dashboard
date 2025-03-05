import React, { useState } from "react";
import { Grid, Card, TextField, Button, Tabs, Tab } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/events/data/authorsTableData";

function Tables() {
  const { columns, rows } = authorsTableData();

  // State for form fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [activity, setActivity] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  // Handle form submission
  const handleFormSubmit = () => {
    console.log({
      eventTitle,
      eventDescription,
      activity,
    });

    setEventTitle("");
    setEventDescription("");
    setActivity("");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {/* Tabs for switching between Event Form and My Events */}
            <Card>
              <MDBox px={3} pt={2}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab label="Add Event" />
                  <Tab label="My Events" />
                </Tabs>
              </MDBox>
            </Card>
          </Grid>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Grid item xs={12}>
              {/* Event Capture Form */}
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
                    Add New Event
                  </MDTypography>
                </MDBox>
                <MDBox p={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Event Title"
                        variant="outlined"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Activity"
                        variant="outlined"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Event Description"
                        variant="outlined"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFormSubmit}
                        style={{ color: "white" }}
                      >
                        Submit Event
                      </Button>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid item xs={12}>
              {/* Event List */}
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
                    My Events
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
