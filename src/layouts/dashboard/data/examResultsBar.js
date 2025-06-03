"use client";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
} from "@mui/material";
import { useState, useMemo } from "react";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ExamResultsBarGraph({ data }) {
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");
  const [selectedCadre, setSelectedCadre] = useState("ALL");
  const [selectedScore, setSelectedScore] = useState("ALL");

  // Process and filter the data
  const processedData = useMemo(() => {
    if (!data || !data.data) return { periods: [], cadres: [], scores: [], chartData: null };

    const allPeriods = Object.keys(data.data).sort();
    const allCadres = new Set();
    const allScores = new Set();
    const filteredResults = [];

    // Extract all unique cadres and scores
    Object.entries(data.data).forEach(([period, results]) => {
      results.forEach((result) => {
        allCadres.add(result.Cadre);
        allScores.add(result.OverallScore?.trim());
      });
    });

    // Filter data based on selections
    Object.entries(data.data).forEach(([period, results]) => {
      if (selectedPeriod !== "ALL" && period !== selectedPeriod) return;

      results.forEach((result) => {
        const cadre = result.Cadre;
        const score = result.OverallScore?.trim();
        const total = Number.parseInt(result.Total) || 0;

        if (selectedCadre !== "ALL" && cadre !== selectedCadre) return;
        if (selectedScore !== "ALL" && score !== selectedScore) return;

        filteredResults.push({
          period,
          cadre,
          score,
          total,
        });
      });
    });

    return {
      periods: allPeriods,
      cadres: Array.from(allCadres).sort(),
      scores: Array.from(allScores).filter(Boolean).sort(),
      filteredResults,
    };
  }, [data, selectedPeriod, selectedCadre, selectedScore]);

  // Create chart data
  const chartData = useMemo(() => {
    if (!processedData.filteredResults.length) {
      return {
        labels: [],
        datasets: [
          {
            label: "No Data",
            data: [],
            backgroundColor: "rgba(156, 163, 175, 0.6)",
            borderColor: "rgba(156, 163, 175, 1)",
            borderWidth: 1,
          },
        ],
      };
    }

    // Group by the most relevant dimension
    let groupBy = "period";
    let chartTitle = "Exam Results by Period";

    if (selectedPeriod !== "ALL" && selectedCadre === "ALL") {
      groupBy = "cadre";
      chartTitle = `Exam Results by Cadre (${selectedPeriod})`;
    } else if (selectedCadre !== "ALL" && selectedPeriod === "ALL") {
      groupBy = "period";
      chartTitle = `Exam Results for ${selectedCadre}`;
    } else if (selectedPeriod !== "ALL" && selectedCadre !== "ALL") {
      groupBy = "score";
      chartTitle = `${selectedCadre} Results (${selectedPeriod})`;
    }

    // Aggregate data
    const aggregated = {};
    processedData.filteredResults.forEach((result) => {
      const key = result[groupBy];
      if (!aggregated[key]) {
        aggregated[key] = 0;
      }
      aggregated[key] += result.total;
    });

    const labels = Object.keys(aggregated).sort();
    const dataValues = labels.map((label) => aggregated[label]);

    // Color scheme based on score types
    const getColor = (label, index) => {
      if (groupBy === "score") {
        const colorMap = {
          PASS: "rgba(34, 197, 94, 0.6)",
          FAILED: "rgba(239, 68, 68, 0.6)",
          CREDIT: "rgba(59, 130, 246, 0.6)",
          DISTINCTION: "rgba(168, 85, 247, 0.6)",
          INCOMPLETE: "rgba(251, 191, 36, 0.6)",
          CANCELLED: "rgba(156, 163, 175, 0.6)",
        };
        return (
          colorMap[label] ||
          `rgba(${100 + index * 30}, ${150 + index * 20}, ${200 + index * 25}, 0.6)`
        );
      }
      return `rgba(${59 + index * 30}, ${130 + index * 20}, ${246 + index * 15}, 0.6)`;
    };

    return {
      labels,
      datasets: [
        {
          label: chartTitle,
          data: dataValues,
          backgroundColor: labels.map((label, index) => getColor(label, index)),
          borderColor: labels.map((label, index) => getColor(label, index).replace("0.6", "1")),
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [processedData, selectedPeriod, selectedCadre, selectedScore]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12 },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.parsed.y.toLocaleString()} students`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = processedData.filteredResults.reduce((sum, result) => sum + result.total, 0);
    const passResults = processedData.filteredResults.filter(
      (r) => r.score === "PASS" || r.score === "CREDIT" || r.score === "DISTINCTION"
    );
    const failResults = processedData.filteredResults.filter((r) => r.score === "FAILED");

    const passCount = passResults.reduce((sum, result) => sum + result.total, 0);
    const failCount = failResults.reduce((sum, result) => sum + result.total, 0);
    const passRate = total > 0 ? ((passCount / total) * 100).toFixed(1) : 0;

    return { total, passCount, failCount, passRate };
  }, [processedData.filteredResults]);

  return (
    <Card sx={{ p: 3, boxShadow: 2 }}>
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Exam Results Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Comprehensive view of nursing exam results with filtering capabilities
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Period</InputLabel>
              <Select
                value={selectedPeriod}
                label="Period"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="ALL">All Periods</MenuItem>
                {processedData.periods.map((period) => (
                  <MenuItem key={period} value={period}>
                    {period}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Cadre</InputLabel>
              <Select
                value={selectedCadre}
                label="Cadre"
                onChange={(e) => setSelectedCadre(e.target.value)}
              >
                <MenuItem value="ALL">All Cadres</MenuItem>
                {processedData.cadres.map((cadre) => (
                  <MenuItem key={cadre} value={cadre}>
                    {cadre.length > 50 ? `${cadre.substring(0, 50)}...` : cadre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Score</InputLabel>
              <Select
                value={selectedScore}
                label="Score"
                onChange={(e) => setSelectedScore(e.target.value)}
              >
                <MenuItem value="ALL">All Scores</MenuItem>
                {processedData.scores.map((score) => (
                  <MenuItem key={score} value={score}>
                    {score}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Active Filters */}
        <Box sx={{ mb: 2 }}>
          {selectedPeriod !== "ALL" && (
            <Chip
              label={`Period: ${selectedPeriod}`}
              onDelete={() => setSelectedPeriod("ALL")}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          )}
          {selectedCadre !== "ALL" && (
            <Chip
              label={`Cadre: ${
                selectedCadre.length > 30 ? `${selectedCadre.substring(0, 30)}...` : selectedCadre
              }`}
              onDelete={() => setSelectedCadre("ALL")}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          )}
          {selectedScore !== "ALL" && (
            <Chip
              label={`Score: ${selectedScore}`}
              onDelete={() => setSelectedScore("ALL")}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          )}
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ height: 400, mb: 3 }}>
        <Bar data={chartData} options={options} />
      </Box>

      {/* Summary Statistics */}
      <Box display="grid" gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }} gap={2}>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="primary" fontWeight="bold">
            Total Students
          </Typography>
          <Typography variant="body2">{summaryStats.total.toLocaleString()}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="success.main" fontWeight="bold">
            Passed
          </Typography>
          <Typography variant="body2">{summaryStats.passCount.toLocaleString()}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="error.main" fontWeight="bold">
            Failed
          </Typography>
          <Typography variant="body2">{summaryStats.failCount.toLocaleString()}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="info.main" fontWeight="bold">
            Pass Rate
          </Typography>
          <Typography variant="body2">{summaryStats.passRate}%</Typography>
        </Box>
      </Box>
    </Card>
  );
}

// Add prop validation
ExamResultsBarGraph.propTypes = {
  data: PropTypes.shape({
    indicator: PropTypes.string,
    data: PropTypes.object,
  }),
};

// Default props
ExamResultsBarGraph.defaultProps = {
  data: {
    indicator: "",
    data: {},
  },
};

export default ExamResultsBarGraph;
