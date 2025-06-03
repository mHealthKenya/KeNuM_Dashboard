"use client";

// @mui material components
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsLineChartData from "layouts/dashboardpractitioner/data/reportsLineChartData";
import licenseRegistrationBarChartData from "layouts/dashboardpractitioner/data/comparisonBarGraph";

// Custom Bar Chart Component (fallback)
import CustomBarChart from "layouts/dashboardpractitioner/data/customBarChart";
import { getMetrics } from "services/analytics/metrics";

import { formatNumberWithCommas } from "utils/formatNumber";
import { CircularProgress, Typography } from "@mui/material";

function PractitionerDashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both datasets in parallel
        const [metricsResponse, studentsResponse] = await Promise.all([
          getMetrics(),
          // getIndexed_Students(),
        ]);
        console.log("Metrics:", metricsResponse);
        console.log("Students:", studentsResponse);
        setMetrics(metricsResponse);
        // setStudentData(studentsResponse.data); // Access nested data property
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="info" size={60} />
        </MDBox>{" "}
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>Error: {error}</MDBox>
      </DashboardLayout>
    );
  }

  // Debugging: Log the chart data
  console.log("Practitioner Chart Data:", licenseRegistrationBarChartData);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Date and Time Section */}
        <MDBox mb={2} display="flex" justifyContent="flex-end">
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            -{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Typography>
        </MDBox>
        <br />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="verified"
                title="Active License"
                count={formatNumberWithCommas(metrics.licensed_professionals)}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people"
                title="Ever Registered Professionals"
                count={formatNumberWithCommas(metrics.ever_registered_professionals)}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title="Inactive License" count="230" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Active Practitioners"
                count="30,358"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Inactive Practitioners"
                count="3,076"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="house"
                title="Practitioners"
                count="40998"
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="airplane"
                title="Outmigration Applications"
                count="2378"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="person"
                title="Private Practice Applications"
                count="1392"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="approval"
                title="Approved CPDs"
                count="2876"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="pending"
                title="Pending CPDs"
                count="765"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="warning"
                title="Rejected CPDs"
                count="376"
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="info"
                  title="License renewals"
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="warning"
                  title="CPDs"
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart color="dark" title="Registrations" chart={tasks} />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              {/* <Projects /> */}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              {/* <OrdersOverview /> */}
            </Grid>
          </Grid>
        </MDBox>

        {/* Add the combined bar graph here */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
                ] <CustomBarChart data={licenseRegistrationBarChartData} />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PractitionerDashboard;
