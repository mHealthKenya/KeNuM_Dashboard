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

// Utility function to format numbers with commas
const formatNumberWithCommas = (num) => {
  return num.toLocaleString();
};

function RetentionBarGraph({ data }) {
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");
  const [selectedNursingType, setSelectedNursingType] = useState("ALL");
  const [selectedCadre, setSelectedCadre] = useState("ALL");

  // Process and filter the data
  const processedData = useMemo(() => {
    if (!data || !data.data)
      return {
        periods: [],
        nursingTypes: [],
        cadres: [],
        chartData: null,
        filteredResults: [],
      };

    const allPeriods = Object.keys(data.data).sort();
    const allNursingTypes = new Set();
    const allCadres = new Set();
    const filteredResults = [];

    // Define nursing type categories based on the actual data structure
    const nursingTypeCategories = {
      "Bachelor's Degree": ["BACHELOR OF SCIENCE IN NURSING", "BACHELOR OF SCIENCE IN MIDWIFERY"],
      "Enrolled Nurses": [
        "KENYA ENROLLED NURSE",
        "KENYA ENROLLED MIDWIFE",
        "KENYA ENROLLED PSYCHIATRIC NURSE",
        "KENYA ENROLLED COMMUNITY HEALTH NURSE [BASIC]",
        "KENYA ENROLLED COMMUNITY HEALTH NURSE [POST BASIC]",
      ],
      "Registered Nurses": [
        "KENYA REGISTERED NURSE",
        "KENYA  REGISTERED MIDWIFE",
        "KENYA REGISTERED MIDWIFE",
        "KENYA REGISTERED COMMUNITY HEALTH NURSE [BASIC]",
        "KENYA  REGISTERED COMMUNITY HEALTH [POST BASIC]",
        "KENYA REGISTERED NURSE MIDWIFE [BASIC]",
      ],
      "Specialized Care": [
        "KENYA REGISTERED CRITICAL CARE NURSE",
        "KENYA REGISTERED PERI-OPERATIVE NURSE",
        "KENYA REGISTERED PSYCHIATRIC NURSE",
        "KENYA REGISTERED PAEDIATRIC NURSE",
        "KENYA REGISTERED ACCIDENT & EMERGENCY NURSE",
        "KENYA REGISTERED NURSE ANAESTHETIST",
        "KENYA REGISTERED NEPHROLOGY NURSE",
        "KENYA REGISTERED NEONATAL NURSE",
        "KENYA REGISTERED ONCOLOGY NURSE",
        "KENYA  REGISTERED OPHTHALMIC NURSE",
        "KENYA REGISTERED OPHTHALMIC NURSE",
        "KENYA REGISTERED PALLIATIVE CARE NURSE",
        "KENYA REGISTERED PAEDIATRIC CRITICAL CARE NURSE",
        "KENYA REGISTERED NEONATAL CRITICAL CARE NURSE",
        "KENYA REGISTERED NURSE/MENTAL HEALTH & PSYCHIATRIC NURSE",
        "KENYA REGISTERED TRAUMA AND EMERGENCY NURSE",
      ],
    };

    // Helper function to categorize nursing type
    const categorizeNursingType = (cadreName) => {
      for (const [type, cadreList] of Object.entries(nursingTypeCategories)) {
        if (cadreList.some((c) => cadreName.includes(c) || c.includes(cadreName))) {
          return type;
        }
      }
      return "Other";
    };

    // Extract all unique nursing types and cadres
    Object.entries(data.data).forEach(([period, cadres]) => {
      Object.values(cadres).forEach((cadre) => {
        const cadreName = cadre.Cadre;
        const nursingType = categorizeNursingType(cadreName);

        allCadres.add(cadreName);
        allNursingTypes.add(nursingType);
      });
    });

    // Filter data based on selections
    Object.entries(data.data).forEach(([period, cadres]) => {
      if (selectedPeriod !== "ALL" && period !== selectedPeriod) return;

      Object.values(cadres).forEach((cadre) => {
        const cadreName = cadre.Cadre;
        const nursingType = categorizeNursingType(cadreName);
        const total = Number.parseInt(cadre.Total) || 0;

        if (selectedNursingType !== "ALL" && nursingType !== selectedNursingType) return;
        if (selectedCadre !== "ALL" && cadreName !== selectedCadre) return;

        filteredResults.push({
          period,
          nursingType,
          cadre: cadreName,
          total,
        });
      });
    });

    return {
      periods: allPeriods,
      nursingTypes: Array.from(allNursingTypes).sort(),
      cadres: Array.from(allCadres).sort(),
      filteredResults,
    };
  }, [data, selectedPeriod, selectedNursingType, selectedCadre]);

  // Create chart data with dynamic grouping logic (similar to ExamResultsBarGraph)
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

    // Dynamic grouping logic based on filter selections
    let groupBy = "period";
    let chartTitle = "Retention by Period";

    if (selectedPeriod !== "ALL" && selectedNursingType === "ALL" && selectedCadre === "ALL") {
      groupBy = "nursingType";
      chartTitle = `Retention by Nursing Type (${selectedPeriod})`;
    } else if (
      selectedNursingType !== "ALL" &&
      selectedPeriod === "ALL" &&
      selectedCadre === "ALL"
    ) {
      groupBy = "period";
      chartTitle = `Retention for ${selectedNursingType}`;
    } else if (
      selectedCadre !== "ALL" &&
      selectedPeriod === "ALL" &&
      selectedNursingType === "ALL"
    ) {
      groupBy = "period";
      chartTitle = `Retention for ${
        selectedCadre.length > 40 ? selectedCadre.substring(0, 40) + "..." : selectedCadre
      }`;
    } else if (
      selectedPeriod !== "ALL" &&
      selectedNursingType !== "ALL" &&
      selectedCadre === "ALL"
    ) {
      groupBy = "cadre";
      chartTitle = `${selectedNursingType} Cadres (${selectedPeriod})`;
    } else if (selectedPeriod !== "ALL" && selectedCadre !== "ALL") {
      groupBy = "nursingType";
      chartTitle = `${
        selectedCadre.length > 30 ? selectedCadre.substring(0, 30) + "..." : selectedCadre
      } (${selectedPeriod})`;
    } else if (selectedNursingType !== "ALL" && selectedCadre !== "ALL") {
      groupBy = "period";
      chartTitle = `${
        selectedCadre.length > 30 ? selectedCadre.substring(0, 30) + "..." : selectedCadre
      } Trends`;
    } else if (
      selectedPeriod !== "ALL" &&
      selectedNursingType !== "ALL" &&
      selectedCadre !== "ALL"
    ) {
      // All filters selected - show single data point or breakdown by available dimension
      groupBy = "period";
      chartTitle = `${
        selectedCadre.length > 25 ? selectedCadre.substring(0, 25) + "..." : selectedCadre
      } (${selectedPeriod})`;
    }

    // Aggregate data based on groupBy
    const aggregated = {};
    processedData.filteredResults.forEach((result) => {
      const key = result[groupBy];
      if (!aggregated[key]) {
        aggregated[key] = 0;
      }
      aggregated[key] += result.total;
    });

    const labels = Object.keys(aggregated).sort((a, b) => {
      // Sort periods numerically, others alphabetically
      if (groupBy === "period") {
        return Number.parseInt(a) - Number.parseInt(b);
      }
      return a.localeCompare(b);
    });

    const dataValues = labels.map((label) => aggregated[label]);

    // Color scheme based on grouping type
    const getColor = (label, index) => {
      // Consistent grey palette for all bars
      const greyPalette = [
        "rgba(107, 114, 128, 0.8)", // Gray-500
        "rgba(75, 85, 99, 0.8)", // Gray-600
        "rgba(156, 163, 175, 0.8)", // Gray-400
        "rgba(55, 65, 81, 0.8)", // Gray-700
        "rgba(209, 213, 219, 0.8)", // Gray-300
        "rgba(31, 41, 55, 0.8)", // Gray-800
        "rgba(243, 244, 246, 0.8)", // Gray-100
        "rgba(17, 24, 39, 0.8)", // Gray-900
        "rgba(229, 231, 235, 0.8)", // Gray-200
        "rgba(139, 146, 158, 0.8)", // Custom gray
      ];

      // Use non-sequential pattern to avoid progression
      const colorIndex = (index * 3) % greyPalette.length;
      return greyPalette[colorIndex];
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
  }, [processedData, selectedPeriod, selectedNursingType, selectedCadre]);

  // Chart options (similar to ExamResultsBarGraph)
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
            `${context.dataset.label}: ${formatNumberWithCommas(context.parsed.y)} retentions`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatNumberWithCommas(value),
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
          callback: function (value, index) {
            const label = this.getLabelForValue(value);
            // Truncate long cadre names for x-axis
            if (label && label.length > 25) {
              return label.substring(0, 25) + "...";
            }
            return label;
          },
        },
      },
    },
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = processedData.filteredResults.reduce((sum, result) => sum + result.total, 0);

    // Calculate statistics by nursing type
    const nursingTypeStats = {};
    processedData.filteredResults.forEach((result) => {
      if (!nursingTypeStats[result.nursingType]) {
        nursingTypeStats[result.nursingType] = 0;
      }
      nursingTypeStats[result.nursingType] += result.total;
    });

    const topNursingType = Object.entries(nursingTypeStats).sort(([, a], [, b]) => b - a)[0];

    // Calculate year range
    const years = [...new Set(processedData.filteredResults.map((r) => r.period))].sort();
    const yearRange =
      years.length > 1 ? `${years[0]}-${years[years.length - 1]}` : years[0] || "N/A";

    // Calculate average per year
    const uniqueYears = new Set(processedData.filteredResults.map((r) => r.period));
    const avgPerYear = uniqueYears.size > 0 ? Math.round(total / uniqueYears.size) : 0;

    return {
      total,
      topNursingType: topNursingType ? topNursingType[0] : "N/A",
      topNursingTypeCount: topNursingType ? topNursingType[1] : 0,
      yearRange,
      avgPerYear,
      totalYears: uniqueYears.size,
      totalCadres: new Set(processedData.filteredResults.map((r) => r.cadre)).size,
    };
  }, [processedData.filteredResults]);

  // Export functionality
  const handleExport = () => {
    try {
      const csvContent = [
        ["Period", "Nursing Type", "Cadre", "Total Retentions"].join(","),
        ...processedData.filteredResults.map((row) =>
          [row.period, `"${row.nursingType}"`, `"${row.cadre}"`, row.total].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nursing_retention_data_${new Date().toISOString().split("T")[0]}.csv`;
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
    setSelectedNursingType("ALL");
    setSelectedCadre("ALL");
  };

  return (
    <Card sx={{ p: 3, boxShadow: 2 }}>
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Nursing Professional Retention Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Comprehensive view of nursing professional retentions in Kenya with advanced filtering
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
              <InputLabel>Nursing Type</InputLabel>
              <Select
                value={selectedNursingType}
                label="Nursing Type"
                onChange={(e) => setSelectedNursingType(e.target.value)}
              >
                <MenuItem value="ALL">All Nursing Types</MenuItem>
                {processedData.nursingTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
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
          {selectedNursingType !== "ALL" && (
            <Chip
              label={`Type: ${selectedNursingType}`}
              onDelete={() => setSelectedNursingType("ALL")}
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
          {(selectedPeriod !== "ALL" ||
            selectedNursingType !== "ALL" ||
            selectedCadre !== "ALL") && (
            <Button
              startIcon={<Clear style={{ color: "red" }} />}
              onClick={clearAllFilters}
              size="small"
              variant="outlined"
              sx={{ ml: 1 }}
            >
              <span style={{ color: "black" }}>Clear All</span>{" "}
            </Button>
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
            Total Retentions
          </Typography>
          <Typography variant="h6">{formatNumberWithCommas(summaryStats.total)}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="success.main" fontWeight="bold">
            Year Range
          </Typography>
          <Typography variant="h6">{summaryStats.yearRange}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="info.main" fontWeight="bold">
            Avg. per Year
          </Typography>
          <Typography variant="h6">{formatNumberWithCommas(summaryStats.avgPerYear)}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="warning.main" fontWeight="bold">
            Top Category
          </Typography>
          <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>
            {summaryStats.topNursingType.length > 15
              ? `${summaryStats.topNursingType.substring(0, 15)}...`
              : summaryStats.topNursingType}
          </Typography>
        </Box>
      </Box>

      {/* Additional Stats Row */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }}
        gap={2}
        sx={{ mt: 2 }}
      >
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Years Covered
          </Typography>
          <Typography variant="body1">{summaryStats.totalYears}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Unique Cadres
          </Typography>
          <Typography variant="body1">{summaryStats.totalCadres}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Top Category Count
          </Typography>
          <Typography variant="body1">
            {formatNumberWithCommas(summaryStats.topNursingTypeCount)}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Nursing Types
          </Typography>
          <Typography variant="body1">{processedData.nursingTypes.length}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

// Add prop validation
RetentionBarGraph.propTypes = {
  data: PropTypes.shape({
    indicator: PropTypes.string,
    data: PropTypes.object,
  }),
};

// Default props
RetentionBarGraph.defaultProps = {
  data: {
    indicator: "",
    data: {},
  },
};

export default RetentionBarGraph;
