// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import PieChart from "examples/Charts/PieChart";

import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import activeInactiveLicensesPieChartData from "layouts/dashboard/data/comparisonPieChart";
import maleFemaleStudentPieChartData from "layouts/dashboard/data/studentComparisonPieChart";

import licenseRegistrationBarChartData from "layouts/dashboard/data/comparisonBarGraph";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Custom Bar Chart Component (fallback)
import CustomBarChart from "layouts/dashboard/data/customBarChart";
function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  // Debugging: Log the chart data
  console.log("Chart Data:", licenseRegistrationBarChartData);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people"
                title="Total practitioners"
                count={67234}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title="Total Students" count="136872" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Pending Licences"
                count="3,637"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Facilities"
                count="2879"
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="License Renewals"
                  description="Last Renewal Performance"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="CPDs"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today rotations.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Registrations"
                  description="Last Performance"
                  chart={tasks}
                />
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

        {/* Pie Chart for Active vs Inactive Licenses */}
        <MDBox mt={4.5}>
          <Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
                <PieChart
                  icon={{ component: "pie_chart", color: "info" }}
                  title="Active vs Inactive Licenses"
                  description="License Distribution Overview"
                  height="250px"
                  chart={activeInactiveLicensesPieChartData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={4.5}>
          <Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
                <PieChart
                  icon={{ component: "pie_chart", color: "info" }}
                  title="Student Distribution"
                  description=" Student Distribution Overview"
                  height="250px"
                  chart={maleFemaleStudentPieChartData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Add the combined bar graph here */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
                {/* Use CustomBarChart if ReportsBarChart doesn't work */}
                <CustomBarChart data={licenseRegistrationBarChartData} />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
