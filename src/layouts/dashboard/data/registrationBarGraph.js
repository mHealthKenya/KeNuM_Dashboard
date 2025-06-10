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
  Alert,
} from "@mui/material";
import { useState, useMemo, useCallback } from "react";
import { School, TrendingUp, FileDownload, Clear } from "@mui/icons-material";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Utility function to format numbers with commas
const formatNumberWithCommas = (num) => {
  return num.toLocaleString();
};

function RegistrationBarGraph({ data }) {
  // State management
  const [filters, setFilters] = useState({
    yearRange: "ALL",
    cadreCategory: "ALL",
    specificCadre: "ALL",
    viewType: "total", // total, category, trend
  });

  // Data processing
  const processedData = useMemo(() => {
    if (!data?.data) {
      return {
        years: [],
        cadreCategories: [],
        specificCadres: [],
        filteredResults: [],
        summary: {
          totalRegistrations: 0,
          totalYears: 0,
          totalCadres: 0,
          peakYear: "",
          peakValue: 0,
        },
      };
    }

    const allYears = Object.keys(data.data).sort();
    const cadreCategories = new Set();
    const specificCadres = new Set();
    const filteredResults = [];

    // Define cadre categories based on the actual data structure
    const cadreTypeCategories = {
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

    // Helper function to categorize cadre type
    const categorizeCadreType = (cadreName) => {
      for (const [type, cadreList] of Object.entries(cadreTypeCategories)) {
        if (cadreList.some((c) => cadreName.includes(c) || c.includes(cadreName))) {
          return type;
        }
      }
      return "Other";
    };

    // Extract all unique cadre categories and specific cadres
    Object.entries(data.data).forEach(([year, cadres]) => {
      Object.values(cadres).forEach((cadre) => {
        const cadreName = cadre.Cadre;
        const cadreType = categorizeCadreType(cadreName);

        specificCadres.add(cadreName);
        cadreCategories.add(cadreType);
      });
    });

    // Apply year range filter
    let filteredYears = allYears;
    if (filters.yearRange !== "ALL") {
      const currentYear = new Date().getFullYear();
      switch (filters.yearRange) {
        case "RECENT_10":
          filteredYears = allYears.filter((year) => currentYear - Number.parseInt(year) <= 10);
          break;
        case "RECENT_20":
          filteredYears = allYears.filter((year) => currentYear - Number.parseInt(year) <= 20);
          break;
        case "RECENT_30":
          filteredYears = allYears.filter((year) => currentYear - Number.parseInt(year) <= 30);
          break;
        case "RECENT_40":
          filteredYears = allYears.filter((year) => currentYear - Number.parseInt(year) <= 40);
          break;
        case "2000_ONWARDS":
          filteredYears = allYears.filter((year) => Number.parseInt(year) >= 2000);
          break;
        case "2010_ONWARDS":
          filteredYears = allYears.filter((year) => Number.parseInt(year) >= 2010);
          break;
        case "2020_ONWARDS":
          filteredYears = allYears.filter((year) => Number.parseInt(year) >= 2020);
          break;
      }
    }

    // Filter data based on selections
    Object.entries(data.data).forEach(([year, cadres]) => {
      if (!filteredYears.includes(year)) return;

      Object.values(cadres).forEach((cadre) => {
        const cadreName = cadre.Cadre;
        const cadreType = categorizeCadreType(cadreName);
        const total = Number.parseInt(cadre.Total) || 0;

        if (filters.cadreCategory !== "ALL" && cadreType !== filters.cadreCategory) return;
        if (filters.specificCadre !== "ALL" && cadreName !== filters.specificCadre) return;

        filteredResults.push({
          year,
          cadreType,
          cadreName,
          total,
        });
      });
    });

    return {
      years: filteredYears,
      cadreCategories: Array.from(cadreCategories).sort(),
      specificCadres: Array.from(specificCadres).sort(),
      filteredResults,
    };
  }, [data, filters]);

  // Create chart data with dynamic grouping logic
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
    let groupBy = "year";
    let chartTitle = "Registrations by Year";

    if (
      filters.yearRange !== "ALL" &&
      filters.cadreCategory === "ALL" &&
      filters.specificCadre === "ALL"
    ) {
      groupBy = "cadreType";
      chartTitle = `Registrations by Category (${filters.yearRange.replace("_", " ")})`;
    } else if (
      filters.cadreCategory !== "ALL" &&
      filters.yearRange === "ALL" &&
      filters.specificCadre === "ALL"
    ) {
      groupBy = "year";
      chartTitle = `Registrations for ${filters.cadreCategory}`;
    } else if (
      filters.specificCadre !== "ALL" &&
      filters.yearRange === "ALL" &&
      filters.cadreCategory === "ALL"
    ) {
      groupBy = "year";
      chartTitle = `Registrations for ${
        filters.specificCadre.length > 40
          ? filters.specificCadre.substring(0, 40) + "..."
          : filters.specificCadre
      }`;
    } else if (
      filters.yearRange !== "ALL" &&
      filters.cadreCategory !== "ALL" &&
      filters.specificCadre === "ALL"
    ) {
      groupBy = "cadreName";
      chartTitle = `${filters.cadreCategory} Cadres (${filters.yearRange.replace("_", " ")})`;
    } else if (filters.yearRange !== "ALL" && filters.specificCadre !== "ALL") {
      groupBy = "cadreType";
      chartTitle = `${
        filters.specificCadre.length > 30
          ? filters.specificCadre.substring(0, 30) + "..."
          : filters.specificCadre
      } (${filters.yearRange.replace("_", " ")})`;
    } else if (filters.cadreCategory !== "ALL" && filters.specificCadre !== "ALL") {
      groupBy = "year";
      chartTitle = `${
        filters.specificCadre.length > 30
          ? filters.specificCadre.substring(0, 30) + "..."
          : filters.specificCadre
      } Trends`;
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
      // Sort years numerically, others alphabetically
      if (groupBy === "year") {
        return Number.parseInt(a) - Number.parseInt(b);
      }
      return a.localeCompare(b);
    });

    const dataValues = labels.map((label) => aggregated[label]);

    // Consistent brown color palette - all colors have similar darkness/lightness
    const consistentBrownPalette = [
      "rgba(165, 113, 100, 0.8)", // Warm brown
      "rgba(142, 85, 40, 0.8)", // Medium brown
      "rgba(170, 132, 85, 0.8)", // Tan brown
      "rgba(120, 80, 50, 0.8)", // Dark brown
      "rgba(160, 100, 60, 0.8)", // Russet brown
      "rgba(140, 100, 70, 0.8)", // Umber
      "rgba(180, 125, 80, 0.8)", // Light brown
      "rgba(130, 90, 60, 0.8)", // Chocolate brown
      "rgba(150, 105, 75, 0.8)", // Medium brown 2
      "rgba(175, 120, 90, 0.8)", // Caramel brown
      "rgba(135, 95, 65, 0.8)", // Coffee brown
      "rgba(155, 110, 80, 0.8)", // Walnut brown
    ];

    // Color scheme based on grouping type
    const getColor = (label, index) => {
      if (groupBy === "cadreType") {
        // Use specific colors for cadre types
        const cadreTypeColors = {
          "Bachelor's Degree": "rgba(165, 113, 100, 0.8)", // Warm brown
          "Enrolled Nurses": "rgba(142, 85, 40, 0.8)", // Medium brown
          "Registered Nurses": "rgba(170, 132, 85, 0.8)", // Tan brown
          "Specialized Care": "rgba(120, 80, 50, 0.8)", // Dark brown
          Other: "rgba(160, 100, 60, 0.8)", // Russet brown
        };
        return (
          cadreTypeColors[label] || consistentBrownPalette[index % consistentBrownPalette.length]
        );
      }

      // For other groupings, use the consistent palette with a non-sequential pattern
      // This creates a more random-looking distribution without a clear dark-to-light progression
      const colorIndex = (index * 3) % consistentBrownPalette.length;
      return consistentBrownPalette[colorIndex];
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
  }, [processedData, filters]);

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
            `${context.dataset.label}: ${formatNumberWithCommas(context.parsed.y)} registrations`,
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

    // Calculate statistics by cadre type
    const cadreTypeStats = {};
    processedData.filteredResults.forEach((result) => {
      if (!cadreTypeStats[result.cadreType]) {
        cadreTypeStats[result.cadreType] = 0;
      }
      cadreTypeStats[result.cadreType] += result.total;
    });

    const topCadreType = Object.entries(cadreTypeStats).sort(([, a], [, b]) => b - a)[0];

    // Calculate year range
    const years = [...new Set(processedData.filteredResults.map((r) => r.year))].sort();
    const yearRange =
      years.length > 1 ? `${years[0]}-${years[years.length - 1]}` : years[0] || "N/A";

    // Calculate average per year
    const uniqueYears = new Set(processedData.filteredResults.map((r) => r.year));
    const avgPerYear = uniqueYears.size > 0 ? Math.round(total / uniqueYears.size) : 0;

    return {
      total,
      topCadreType: topCadreType ? topCadreType[0] : "N/A",
      topCadreTypeCount: topCadreType ? topCadreType[1] : 0,
      yearRange,
      avgPerYear,
      totalYears: uniqueYears.size,
      totalSpecificCadres: new Set(processedData.filteredResults.map((r) => r.cadreName)).size,
    };
  }, [processedData.filteredResults]);

  // Export functionality
  const handleExport = () => {
    try {
      const csvContent = [
        ["Year", "Cadre Type", "Specific Cadre", "Total Registrations"].join(","),
        ...processedData.filteredResults.map((row) =>
          [row.year, `"${row.cadreType}"`, `"${row.cadreName}"`, row.total].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nursing_registration_data_${new Date().toISOString().split("T")[0]}.csv`;
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
    setFilters({
      yearRange: "ALL",
      cadreCategory: "ALL",
      specificCadre: "ALL",
      viewType: "total",
    });
  };

  // Event handlers
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  }, []);

  // No data state
  if (!data?.data || Object.keys(data.data).length === 0) {
    return (
      <Card sx={{ p: 3, boxShadow: 2 }}>
        <Alert severity="info">
          No registration data available. Please check your data source.
        </Alert>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, boxShadow: 2 }}>
      {/* Header Section */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Nursing Professional Registration Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Comprehensive view of nursing professional registrations in Kenya with advanced filtering
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Period</InputLabel>
              <Select
                value={filters.yearRange}
                label="Time Period"
                onChange={(e) => handleFilterChange("yearRange", e.target.value)}
              >
                <MenuItem value="ALL">All Years (1900-2025)</MenuItem>
                <MenuItem value="RECENT_10">Last 10 Years</MenuItem>
                <MenuItem value="RECENT_20">Last 20 Years</MenuItem>
                <MenuItem value="RECENT_30">Last 30 Years</MenuItem>
                <MenuItem value="RECENT_40">Last 40 Years</MenuItem>
                <MenuItem value="2020_ONWARDS">2020 Onwards</MenuItem>
                <MenuItem value="2010_ONWARDS">2010 Onwards</MenuItem>
                <MenuItem value="2000_ONWARDS">2000 Onwards</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Cadre Category</InputLabel>
              <Select
                value={filters.cadreCategory}
                label="Cadre Category"
                onChange={(e) => handleFilterChange("cadreCategory", e.target.value)}
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                {processedData.cadreCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Specific Cadre</InputLabel>
              <Select
                value={filters.specificCadre}
                label="Specific Cadre"
                onChange={(e) => handleFilterChange("specificCadre", e.target.value)}
              >
                <MenuItem value="ALL">All Cadres</MenuItem>
                {processedData.specificCadres.map((cadre) => (
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
          {filters.yearRange !== "ALL" && (
            <Chip
              label={`Period: ${filters.yearRange.replace("_", " ")}`}
              onDelete={() => handleFilterChange("yearRange", "ALL")}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          )}
          {filters.cadreCategory !== "ALL" && (
            <Chip
              label={`Category: ${filters.cadreCategory}`}
              onDelete={() => handleFilterChange("cadreCategory", "ALL")}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          )}
          {filters.specificCadre !== "ALL" && (
            <Chip
              label={`Cadre: ${
                filters.specificCadre.length > 30
                  ? `${filters.specificCadre.substring(0, 30)}...`
                  : filters.specificCadre
              }`}
              onDelete={() => handleFilterChange("specificCadre", "ALL")}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          )}
          {(filters.yearRange !== "ALL" ||
            filters.cadreCategory !== "ALL" ||
            filters.specificCadre !== "ALL") && (
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

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="primary.light" borderRadius={1}>
              <Typography variant="h6" color="primary.contrastText">
                {formatNumberWithCommas(summaryStats.total)}
              </Typography>
              <Typography variant="caption" color="primary.contrastText">
                Total Registrations
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={1}>
              <Typography variant="h6" color="success.contrastText">
                {summaryStats.yearRange}
              </Typography>
              <Typography variant="caption" color="success.contrastText">
                Year Range
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={1}>
              <Typography variant="h6" color="info.contrastText">
                {formatNumberWithCommas(summaryStats.avgPerYear)}
              </Typography>
              <Typography variant="caption" color="info.contrastText">
                Avg. per Year
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={1}>
              <Typography variant="h6" color="warning.contrastText" sx={{ fontSize: "0.9rem" }}>
                {summaryStats.topCadreType.length > 15
                  ? `${summaryStats.topCadreType.substring(0, 15)}...`
                  : summaryStats.topCadreType}
              </Typography>
              <Typography variant="caption" color="warning.contrastText">
                Top Category
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Chart */}
      <Box sx={{ height: 400, mb: 3 }}>
        <Bar data={chartData} options={options} />
      </Box>

      {/* Additional Stats Row */}
      <Box display="grid" gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }} gap={2}>
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
          <Typography variant="body1">{summaryStats.totalSpecificCadres}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Top Category Count
          </Typography>
          <Typography variant="body1">
            {formatNumberWithCommas(summaryStats.topCadreTypeCount)}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Categories
          </Typography>
          <Typography variant="body1">{processedData.cadreCategories.length}</Typography>
        </Box>
      </Box>

      {/* Footer Info */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <School fontSize="small" color="primary" />
          <Typography variant="caption">
            Peak Category: {formatNumberWithCommas(summaryStats.topCadreTypeCount)}{" "}
            {summaryStats.topCadreType} registrations
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <TrendingUp fontSize="small" color="success" />
          <Typography variant="caption">
            Spanning {summaryStats.totalYears} years of data
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

// PropTypes validation
RegistrationBarGraph.propTypes = {
  data: PropTypes.shape({
    indicator: PropTypes.string,
    data: PropTypes.object,
  }),
};

// Default props
RegistrationBarGraph.defaultProps = {
  data: {
    indicator: "",
    data: {},
  },
};

export default RegistrationBarGraph;
