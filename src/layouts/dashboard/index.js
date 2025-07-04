"use client";

import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import WelcomeBanner from "components/welcomebaner";
import ExamApplicationsBarGraph from "./data/examApplicationBar.js";
import InternshipApplicationsBarGraph from "./data/internshipApplicationsBar.js";
import ExamResultsBarGraph from "./data/examResultsBar.js";
import InternshipPostingsTable from "./data/internshipPostingsTable.js";
import RegistrationBarGraph from "./data/registrationBarGraph.js";
import RetentionBarGraph from "./data/retentionBarGraph.js";
import ExamPieChart from "./data/examResultsPieChart.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

// API functions
import { getIndexed_Students } from "services/analytics/indexed_students";
import { getMetrics } from "services/analytics/metrics";
import {
  getExamApplicationMetrics,
  getExamResultsMetrics,
  getInternshipApplicationMetrics,
  getInternshipPostingsMetrics,
  getRegistrationMetrics,
  getRetentionMetrics,
} from "services/analytics/metrics";
import { formatNumberWithCommas } from "utils/formatNumber";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [examData, setExamData] = useState(null);
  const [internshipData, setInternshipData] = useState(null);
  const [examResultsData, setExamResultsData] = useState(null);
  const [internshipPostingsData, setInternshipPostingsData] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [retentionData, setRetentionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all datasets in parallel
        const [
          metricsResponse,
          studentsResponse,
          examResponse,
          internshipResponse,
          examResultsResponse,
          internshipPostingsResponse,
          registrationResponse,
          retentionResponse,
        ] = await Promise.all([
          getMetrics(),
          getIndexed_Students(),
          getExamApplicationMetrics(),
          getInternshipApplicationMetrics(),
          getExamResultsMetrics(),
          getInternshipPostingsMetrics(),
          getRegistrationMetrics(),
          getRetentionMetrics(),
        ]);

        console.log("Metrics:", metricsResponse);
        console.log("Students:", studentsResponse);
        console.log("Exam Applications:", examResponse);
        console.log("Internship Applications:", internshipResponse);
        console.log("Exam Results:", examResultsResponse);
        console.log("Internship Postings:", internshipPostingsResponse);
        console.log("Registration Data:", registrationResponse);
        console.log("Retention Data:", retentionResponse);

        setMetrics(metricsResponse || {});
        setStudentData(studentsResponse?.data || []);
        setExamData(examResponse || null);
        setInternshipData(internshipResponse || null);
        setExamResultsData(examResultsResponse || null);
        setInternshipPostingsData(internshipPostingsResponse || null);
        setRegistrationData(registrationResponse || null);
        setRetentionData(retentionResponse || null);
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
        <MDBox py={3} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="info" size={60} />
        </MDBox>
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

        {/* Charts Section */}
        <MDBox mt={4}>
          <Grid container spacing={3}>
            {/* Exam Applications Chart */}
            <Grid item xs={12} lg={6}>
              <ExamApplicationsBarGraph data={examData} />
            </Grid>

            {/* Internship Applications Chart */}
            <Grid item xs={12} lg={6}>
              <InternshipApplicationsBarGraph data={internshipData} />
            </Grid>
          </Grid>
        </MDBox>

        {/* Registration Data Chart */}
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RegistrationBarGraph data={registrationData} />
            </Grid>
          </Grid>
        </MDBox>

        {/* Retention Data Chart */}
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RetentionBarGraph data={retentionData} />
            </Grid>
          </Grid>
        </MDBox>

        {/* Exam Results Chart */}
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ExamResultsBarGraph data={examResultsData} />
            </Grid>
          </Grid>
        </MDBox>

        {/* NEW: Exam Results Pie Chart */}
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ExamPieChart data={examResultsData} />
            </Grid>
          </Grid>
        </MDBox>

        {/* Internship Postings Table */}
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InternshipPostingsTable data={internshipPostingsData} />
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
                      {/* Header Row */}
                      <TableRow
                        sx={{
                          backgroundColor: "#E3F2FD",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          "& th": {
                            color: "#0D47A1",
                            fontWeight: "bold",
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="col"
                          sx={{ width: "60%", textAlign: "left" }}
                        >
                          Program
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="col"
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
