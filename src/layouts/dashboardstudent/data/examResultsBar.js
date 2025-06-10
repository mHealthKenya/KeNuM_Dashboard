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
  Button,
} from "@mui/material";
import { useState, useMemo } from "react";
import { FileDownload, Clear } from "@mui/icons-material";

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

    // Consistent blue color palette - avoiding dark-to-light progression
    const consistentBluePalette = [
      "rgba(59, 130, 246, 0.8)", // Blue
      "rgba(37, 99, 235, 0.8)", // Blue-600
      "rgba(96, 165, 250, 0.8)", // Blue-400
      "rgba(147, 197, 253, 0.8)", // Blue-300
      "rgba(30, 64, 175, 0.8)", // Blue-800
      "rgba(75, 85, 99, 0.8)", // Gray-600
      "rgba(107, 114, 128, 0.8)", // Gray-500
      "rgba(156, 163, 175, 0.8)", // Gray-400
      "rgba(55, 65, 81, 0.8)", // Gray-700
      "rgba(17, 24, 39, 0.8)", // Gray-900
    ];

    // Color scheme based on score types or consistent palette
    const getColor = (label, index) => {
      if (groupBy === "score") {
        // Fixed colors for score types
        const scoreColorMap = {
          PASS: "rgba(34, 197, 94, 0.8)", // Green
          FAILED: "rgba(239, 68, 68, 0.8)", // Red
          CREDIT: "rgba(59, 130, 246, 0.8)", // Blue
          DISTINCTION: "rgba(168, 85, 247, 0.8)", // Purple
          INCOMPLETE: "rgba(251, 191, 36, 0.8)", // Yellow
          CANCELLED: "rgba(156, 163, 175, 0.8)", // Gray
        };
        return scoreColorMap[label] || consistentBluePalette[index % consistentBluePalette.length];
      }

      // For other groupings, use consistent blue palette with non-sequential pattern
      const colorIndex = (index * 2) % consistentBluePalette.length;
      return consistentBluePalette[colorIndex];
    };

    return {
      labels,
      datasets: [
        {
          label: chartTitle,
          data: dataValues,
          backgroundColor: labels.map((label, index) => getColor(label, index)),
          borderColor: labels.map((label, index) => getColor(label, index).replace("0.8", "1")),
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

  // Export functionality
  const handleExport = () => {
    try {
      const csvContent = [
        ["Period", "Cadre", "Score", "Total Students"].join(","),
        ...processedData.filteredResults.map((row) =>
          [row.period, `"${row.cadre}"`, row.score, row.total].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `exam_results_data_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedPeriod("ALL");
    setSelectedCadre("ALL");
    setSelectedScore("ALL");
  };

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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
            <Button
              startIcon={<FileDownload style={{ color: "red" }} />}
              onClick={handleExport}
              size="small"
              variant="outlined"
              sx={{ ml: "auto" }}
            >
              {/* Export */}
              <span style={{ color: "black" }}>Export</span>
            </Button>
          </Grid>
        </Grid>

        {/* Active Filters */}
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
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
          {(selectedPeriod !== "ALL" || selectedCadre !== "ALL" || selectedScore !== "ALL") && (
            <Button
              startIcon={<Clear />}
              onClick={clearAllFilters}
              size="small"
              variant="outlined"
              sx={{ ml: 1 }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="primary.light" borderRadius={1}>
              <Typography variant="h6" color="primary.contrastText">
                {summaryStats.total.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="primary.contrastText">
                Total Students
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={1}>
              <Typography variant="h6" color="success.contrastText">
                {summaryStats.passCount.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="success.contrastText">
                Passed
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="error.light" borderRadius={1}>
              <Typography variant="h6" color="error.contrastText">
                {summaryStats.failCount.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="error.contrastText">
                Failed
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={1}>
              <Typography variant="h6" color="info.contrastText">
                {summaryStats.passRate}%
              </Typography>
              <Typography variant="caption" color="info.contrastText">
                Pass Rate
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Chart */}
      <Box sx={{ height: 400, mb: 3 }}>
        <Bar data={chartData} options={options} />
      </Box>

      {/* Additional Summary */}
      <Box display="grid" gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }} gap={2}>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Periods Covered
          </Typography>
          <Typography variant="body1">{processedData.periods.length}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Unique Cadres
          </Typography>
          <Typography variant="body1">{processedData.cadres.length}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Score Types
          </Typography>
          <Typography variant="body1">{processedData.scores.length}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Avg. per Period
          </Typography>
          <Typography variant="body1">
            {processedData.periods.length > 0
              ? Math.round(summaryStats.total / processedData.periods.length).toLocaleString()
              : 0}
          </Typography>
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
