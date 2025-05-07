// @mui material components
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import PieChart from "examples/Charts/PieChart";

import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
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

// Data
import reportsLineChartData from "layouts/dashboardstudent/data/reportsLineChartData";
import licenseRegistrationBarChartData from "layouts/dashboardstudent/data/comparisonBarGraph";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Custom Bar Chart Component (fallback)
import CustomBarChart from "layouts/dashboardstudent/data/customBarChart";

import { getIndexed_Students } from "services/analytics/indexed_students";
import { getMetrics } from "services/analytics/metrics";
import { formatNumberWithCommas } from "utils/formatNumber";

function StudentDashboard() {
  const { sales, tasks } = reportsLineChartData;
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

  const genderPieChartData = {
    labels: ["Female", "Male", "Unknown"],
    datasets: [
      {
        label: "Students by Gender",
        backgroundColor: [
          "#F946A8", // Vibrant pink for female
          "#2159E4", // Bright blue for male
          "#FFA500", // Orange for unknown (more visible)
        ],
        borderColor: [
          "#C2185B", // Darker pink border
          "#1565C0", // Darker blue border
          "#FF8C00", // Darker orange border
        ],
        borderWidth: 2,
        data: [genderData.female, genderData.male, genderData.unknown],
      },
    ],
  };
  const getTotalStudents = (program) => {
    return program.Genders.reduce((total, gender) => total + gender.Total, 0);
  };

  // Debugging: Log the chart data
  console.log("Student Chart Data:", licenseRegistrationBarChartData);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Total Students"
                count="50,000"
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Indexed Students"
                count={metrics.indexed_students}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="dark" icon="people" title="Interns" count={281} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title="Active Checkins" count="34,342" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title="Inactive Checkins" count="345" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Registrations"
                count="278"
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="book"
                title="Exam Applications"
                count="7854"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="book"
                title="Internship Registration"
                count="7854"
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="License Renewals"
                  description="Last Renewal Performance"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid> */}
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Rotations"
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart color="error" title="Transfers" chart={tasks} />
              </MDBox>
            </Grid>
          </Grid>

          {/* Student Data Visualizations */}
          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
                  <PieChart
                    icon={{ component: "people", color: "info" }}
                    title="Student Gender Distribution"
                    description="Across all programs"
                    height="300px"
                    chart={genderPieChartData}
                    options={{
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            color: "#333", // Dark text for better visibility
                            font: {
                              size: 14,
                              weight: "bold",
                            },
                            padding: 20,
                            usePointStyle: true,
                          },
                        },
                      },
                      elements: {
                        arc: {
                          borderWidth: 2,
                          borderColor: "#fff", // White border between segments
                        },
                      },
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
                  <PieChart
                    icon={{ component: "school", color: "dark" }}
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
          </MDBox>

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
                      <TableBody>
                        {/* Header Row - now part of TableBody */}
                        <TableRow
                          sx={{
                            backgroundColor: "#E3F2FD",
                            "& th": {
                              color: "#0D47A1",
                              fontWeight: "bold",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#E3F2FD",
                            },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ width: "60%", textAlign: "left" }}
                          >
                            Program
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ width: "40%", textAlign: "right" }}
                          >
                            Total Students
                          </TableCell>
                        </TableRow>

                        {/* Data Rows */}
                        {Array.isArray(studentData) &&
                          studentData.map((program, index) => {
                            if (!program) return null;
                            const total = getTotalStudents(program);

                            return (
                              <TableRow
                                key={program.Program || index}
                                sx={{
                                  "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
                                  "&:nth-of-type(odd)": { backgroundColor: "white" },
                                  "&:hover": { backgroundColor: "#e3f2fd" },
                                }}
                              >
                                <TableCell component="td" sx={{ width: "60%", textAlign: "left" }}>
                                  {program.Program || "Unknown Program"}
                                </TableCell>
                                <TableCell sx={{ width: "40%", textAlign: "right" }}>
                                  {formatNumberWithCommas(total)}
                                </TableCell>
                              </TableRow>
                            );
                          })}

                        {/* Total row */}
                        {Array.isArray(studentData) && studentData.length > 0 && (
                          <TableRow
                            sx={{
                              backgroundColor: "#e8eaf6",
                              "& th, & td": {
                                fontWeight: "bold",
                                position: "sticky",
                                bottom: 0,
                                backgroundColor: "#e8eaf6",
                                zIndex: 1,
                              },
                            }}
                          >
                            <TableCell component="th" scope="row" sx={{ width: "60%" }}>
                              <strong>Total</strong>
                            </TableCell>
                            <TableCell sx={{ width: "40%", textAlign: "right" }}>
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
        <MDBox mt={4.5}>
          {/* Training Information Section Header */}
          <MDBox mb={3} borderRadius="lg" bgColor="grey-100" p={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Training & Internship Overview
            </Typography>

            {/* First Row - Internship and Rotation Stats */}
            <Grid container spacing={3} mt={2}>
              {/* Internship Status - Full width on mobile, half on medium+ */}
              <Grid item xs={12} md={6}>
                <MDBox p={3} borderRadius="lg" bgcolor="white" boxShadow={1} height="100%">
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
                    Internship Status Distribution
                  </Typography>
                  <PieChart
                    height="300px"
                    chart={{
                      labels: ["Active", "Completed", "Terminated"],
                      datasets: [
                        {
                          data: [1250, 980, 45],
                          backgroundColor: ["#4CAF50", "#2196F3", "#F44336"],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            font: {
                              size: 14,
                            },
                            padding: 20,
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const total = context.dataset.data.reduce((a, b) => a + b);
                              const percentage = Math.round((context.raw / total) * 100);
                              return `${context.label}: ${context.raw} interns (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </MDBox>
              </Grid>

              {/* Rotation Distribution */}
              <Grid item xs={12} md={6}>
                <MDBox p={3} borderRadius="lg" bgcolor="white" boxShadow={1} height="100%">
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
                    Rotation Specialties
                  </Typography>
                  <PieChart
                    height="300px"
                    chart={{
                      labels: ["Medical", "Surgical", "Community", "Specialty"],
                      datasets: [
                        {
                          data: [650, 580, 420, 300],
                          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            font: {
                              size: 14,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              return `${context.label}: ${context.raw} students`;
                            },
                          },
                        },
                      },
                      cutout: "50%", // Makes it a donut chart
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>

            {/* Second Row - Transfers and Institutions */}
            <Grid container spacing={3} mt={0}>
              {/* Transfer Requests */}
              <Grid item xs={12} md={6}>
                <MDBox p={3} borderRadius="lg" bgcolor="white" boxShadow={1} height="100%">
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
                    Transfer Request Status
                  </Typography>
                  <PieChart
                    height="300px"
                    chart={{
                      labels: ["Approved", "Pending", "Rejected"],
                      datasets: [
                        {
                          data: [320, 150, 42],
                          backgroundColor: [
                            "#4CAF50", // Green for approved
                            "#FFC107", // Amber for pending
                            "#F44336", // Red for rejected
                          ],
                          borderWidth: 2,
                          borderColor: "#ffffff",
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            font: {
                              size: 14,
                              weight: "500",
                            },
                            padding: 20,
                            usePointStyle: true,
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const total = context.dataset.data.reduce((a, b) => a + b);
                              const percentage = Math.round((context.raw / total) * 100);
                              return `${context.label}: ${context.raw} requests (${percentage}%)`;
                            },
                          },
                        },
                      },
                      cutout: "50%", // Makes it a donut chart
                      maintainAspectRatio: false,
                    }}
                  />
                </MDBox>
              </Grid>

              {/* Training Institutions */}
              <Grid item xs={12} md={6}>
                <MDBox p={3} borderRadius="lg" bgcolor="white" boxShadow={1} height="100%">
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
                    Top Training Institutions
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table size="medium">
                      <TableBody>
                        {/* Header Row - now inside TableBody but styled as header */}
                        <TableRow
                          sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#E3F2FD",
                            "& th": {
                              fontWeight: "bold",
                              color: "#0D47A1",
                            },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ width: "70%", textAlign: "left" }}
                          >
                            Institution
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ width: "30%", textAlign: "right" }}
                          >
                            Students
                          </TableCell>
                        </TableRow>

                        {/* Data Rows */}
                        {[
                          { name: "National Referral Hospital", students: 450 },
                          { name: "County Teaching Hospital", students: 320 },
                          { name: "University Medical Center", students: 280 },
                          { name: "Private Specialist Hospital", students: 150 },
                          { name: "Regional General Hospital", students: 120 },
                        ].map((row) => (
                          <TableRow key={row.name} hover>
                            <TableCell sx={{ width: "70%", textAlign: "left" }}>
                              {row.name}
                            </TableCell>
                            <TableCell sx={{ width: "30%", textAlign: "right" }}>
                              {formatNumberWithCommas(row.students)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
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

export default StudentDashboard;
