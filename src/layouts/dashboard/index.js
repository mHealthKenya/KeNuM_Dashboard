"use client";

import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import WelcomeBanner from "components/welcomebaner";
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
        setMetrics(metricsResponse || {}); // Provide default empty object
        setStudentData(studentsResponse?.data || []); // Provide default empty array
        setLoading(false);
      } catch (err) {
        setError(err?.message || "An error occurred");
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

  // Process student data for visualizations with null checks
  const processGenderDistribution = () => {
    if (!studentData || !Array.isArray(studentData)) return { female: 0, male: 0, unknown: 0 };
    const totals = { female: 0, male: 0, unknown: 0 };
    studentData.forEach((program) => {
      if (program && program.Genders && Array.isArray(program.Genders)) {
        program.Genders.forEach((gender) => {
          if (gender) {
            if (gender.Gender === "F") totals.female += gender.Total || 0;
            else if (gender.Gender === "M") totals.male += gender.Total || 0;
            else totals.unknown += gender.Total || 0;
          }
        });
      }
    });
    return totals;
  };

  const genderData = processGenderDistribution();

  // Function to calculate total students per program with null checks
  const getTotalStudents = (program) => {
    if (!program || !program.Genders || !Array.isArray(program.Genders)) return 0;
    return program.Genders.reduce((total, gender) => total + (gender?.Total || 0), 0);
  };

  // Ensure metrics is an object to prevent undefined errors
  const safeMetrics = metrics || {};

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Welcome Banner */}
        <WelcomeBanner />
        <br />

        {/* Top Metrics Cards */}
        <Grid container spacing={3}>
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
              <ComplexStatisticsCard
                color="success"
                icon="school"
                title="Active Interns"
                count={formatNumberWithCommas(safeMetrics.active_interns || 0)}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people"
                title="Ever Registered Professionals"
                count={formatNumberWithCommas(safeMetrics.ever_registered_professionals || 0)}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="verified"
                title="Licensed Professionals"
                count={formatNumberWithCommas(safeMetrics.licensed_professionals || 0)}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="verified_outlned"
                title="Licenced Private Practitioners"
                count={formatNumberWithCommas(safeMetrics.licenced_private_practitioners || 0)}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="people_add"
                title="Private Practitioners"
                count={formatNumberWithCommas(safeMetrics.private_practitioners || 0)}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="flight"
                title="Emigration Applications"
                count={formatNumberWithCommas(safeMetrics.emigration_applications || 0)}
              />
            </MDBox>
          </Grid>
        </Grid>

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
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
