import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

// API functions
import { getIndexed_Students } from "services/analytics/indexed_students";
import { getMetrics } from "services/analytics/metrics";
import { formatNumberWithCommas } from "utils/formatNumber";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both datasets in parallel
        const [metricsResponse, studentsResponse] = await Promise.all([
          getMetrics(),
          getIndexed_Students(),
        ]);
        console.log("Metrics:", metricsResponse);
        console.log("Students:", studentsResponse);
        setMetrics(metricsResponse);
        setStudentData(studentsResponse.data); // Access nested data property
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
        <MDBox py={3}>Loading dashboard data...</MDBox>
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

  // Process student data for visualizations
  const processGenderDistribution = () => {
    if (!studentData) return { female: 0, male: 0, unknown: 0 };
    const totals = { female: 0, male: 0, unknown: 0 };
    studentData.forEach((program) => {
      program.Genders.forEach((gender) => {
        if (gender.Gender === "F") totals.female += gender.Total;
        else if (gender.Gender === "M") totals.male += gender.Total;
        else totals.unknown += gender.Total;
      });
    });
    return totals;
  };

  const genderData = processGenderDistribution();

  // Pie chart data
  const genderPieChartData = {
    labels: ["Female", "Male", "Unknown"],
    datasets: [
      {
        label: "Students by Gender",
        backgroundColor: ["#F946A8", "#2159E4", "#333333"], // Dark pink, blue, dark gray
        data: [genderData.female, genderData.male, genderData.unknown],
      },
    ],
  };

  // Function to calculate total students per program
  const getTotalStudents = (program) => {
    return program.Genders.reduce((total, gender) => total + gender.Total, 0);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Top Metrics Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="school"
                title="Active Interns"
                count={formatNumberWithCommas(metrics.active_interns)}
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
              <ComplexStatisticsCard
                color="success"
                icon="verified"
                title="Licensed Professionals"
                count={formatNumberWithCommas(metrics.licensed_professionals)}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="verified_outlned"
                title="Licenced Private Practitioners"
                count={formatNumberWithCommas(metrics.licenced_private_practitioners)}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="people_add"
                title="Private Practitioners"
                count={formatNumberWithCommas(metrics.private_practitioners)}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="flight"
                title="Emigration Applications"
                count={formatNumberWithCommas(metrics.emigration_applications)}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="flight"
                title="Licenced Private Practitioners"
                count={formatNumberWithCommas(metrics.licensed_private_practitioners)}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Student Data Visualizations */}
        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
                <PieChart
                  icon={{ component: "people", color: "info" }}
                  title="Student Gender Distribution"
                  description="Across all programs"
                  height="300px"
                  chart={genderPieChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
                <PieChart
                  icon={{ component: "school", color: "info" }}
                  title="Program Enrollment Distribution"
                  description="Top 5 programs by student count"
                  height="19rem"
                  chart={{
                    labels:
                      studentData
                        ?.slice(0, 5)
                        .map((p) =>
                          p.Program.length > 20 ? `${p.Program.substring(0, 20)}...` : p.Program
                        ) || [],
                    datasets: [
                      {
                        label: "Students",
                        backgroundColor: [
                          "#FF6384", // Pink
                          "#36A2EB", // Blue
                          "#FFCE56", // Yellow
                          "#4BC0C0", // Teal
                          "#9966FF", // Purple
                        ],
                        data: studentData
                          ?.slice(0, 5)
                          .map((p) => p.Genders.reduce((sum, g) => sum + g.Total, 0)) || [
                          0, 0, 0, 0, 0,
                        ],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          padding: 20,
                          font: {
                            size: 12,
                            family: "Roboto",
                          },
                          usePointStyle: true,
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || "";
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} students (${percentage}%)`;
                          },
                        },
                      },
                    },
                    cutout: "60%", // Makes it a donut chart
                    borderRadius: 5, // Rounded segment edges
                    spacing: 2, // Space between segments
                  }}
                />
              </MDBox>
            </Grid>
          </Grid> 
        </MDBox> */}

        {/* Student Data Table */}
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox borderRadius="lg" bgColor="grey-100" p={3}>
                <Typography variant="h6" gutterBottom>
                  Student Program Distribution Details
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "#E3F2FD",
                          "& th": { color: "#0D47A1", fontWeight: "bold" },
                        }}
                      >
                        <TableCell width="60%" align="left">
                          Program
                        </TableCell>
                        <TableCell width="40%" align="right">
                          Total Students
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentData?.map((program, index) => {
                        const total = getTotalStudents(program);

                        return (
                          <TableRow
                            key={program.Program}
                            sx={{
                              "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
                              "&:nth-of-type(even)": { backgroundColor: "white" },
                              "&:hover": { backgroundColor: "#e3f2fd" },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {program.Program}
                            </TableCell>
                            <TableCell align="right">{formatNumberWithCommas(total)}</TableCell>
                          </TableRow>
                        );
                      })}
                      {/* Total row */}
                      {studentData && (
                        <TableRow
                          sx={{ backgroundColor: "#e8eaf6", "& th, & td": { fontWeight: "bold" } }}
                        >
                          <TableCell component="th" scope="row">
                            <strong>Total</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>
                              {formatNumberWithCommas(
                                genderData.female + genderData.male + genderData.unknown
                              )}
                            </strong>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
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
