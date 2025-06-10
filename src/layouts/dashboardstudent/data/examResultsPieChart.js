"use client";

import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
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
  TextField,
  Autocomplete,
} from "@mui/material";
import { FileDownload, Clear } from "@mui/icons-material";

const SCORE_COLORS = {
  PASS: "rgba(34, 197, 94, 0.8)", // Green
  FAILED: "rgba(239, 68, 68, 0.8)", // Red
  CREDIT: "rgba(59, 130, 246, 0.8)", // Blue
  DISTINCTION: "rgba(168, 85, 247, 0.8)", // Purple
  CANCELLED: "rgba(251, 191, 36, 0.8)", // Yellow
  INCOMPLETE: "rgba(156, 163, 175, 0.8)", // Gray
  WITHDRAWN: "rgba(245, 101, 101, 0.8)", // Light Red
  UNKNOWN: "rgba(107, 114, 128, 0.8)", // Dark Gray
};

const ExamPieChart = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");
  const [selectedCadre, setSelectedCadre] = useState("ALL");
  const [cadreSearchTerm, setCadreSearchTerm] = useState("");

  // Process the exam data
  const processedData = useMemo(() => {
    if (!data || !data.data) return { chartData: [], periods: [], cadres: [], filteredResults: [] };

    const periods = Object.keys(data.data).sort();
    const cadresSet = new Set();
    const scoreAggregation = {};
    const filteredResults = [];

    // Collect all cadres and aggregate scores
    Object.entries(data.data).forEach(([period, periodData]) => {
      if (selectedPeriod !== "ALL" && period !== selectedPeriod) return;

      periodData.forEach((entry) => {
        const cleanCadre = entry.Cadre?.trim() || "UNKNOWN";
        cadresSet.add(cleanCadre);

        if (selectedCadre !== "ALL" && cleanCadre !== selectedCadre) return;

        const cleanScore = entry.OverallScore?.replace(/\r/g, "").trim() || "UNKNOWN";
        const total = Number.parseInt(entry.Total) || 0;

        if (!scoreAggregation[cleanScore]) {
          scoreAggregation[cleanScore] = 0;
        }
        scoreAggregation[cleanScore] += total;

        filteredResults.push({
          period,
          cadre: cleanCadre,
          score: cleanScore,
          total,
        });
      });
    });

    // Convert to chart data format
    const chartData = Object.entries(scoreAggregation)
      .map(([score, total]) => ({
        name: score,
        value: total,
        color: SCORE_COLORS[score] || SCORE_COLORS.UNKNOWN,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      chartData,
      periods: periods,
      cadres: Array.from(cadresSet).sort(),
      filteredResults,
    };
  }, [data, selectedPeriod, selectedCadre]);

  const { chartData, periods, cadres, filteredResults } = processedData;

  // Filter cadres based on search term
  const filteredCadres = useMemo(() => {
    if (!cadreSearchTerm) return cadres;
    return cadres.filter((cadre) => cadre.toLowerCase().includes(cadreSearchTerm.toLowerCase()));
  }, [cadres, cadreSearchTerm]);

  // Calculate summary statistics (still needed for tooltips and export)
  const summaryStats = useMemo(() => {
    const total = filteredResults.reduce((sum, result) => sum + result.total, 0);
    const passResults = filteredResults.filter(
      (r) => r.score === "PASS" || r.score === "CREDIT" || r.score === "DISTINCTION"
    );
    const failResults = filteredResults.filter((r) => r.score === "FAILED");

    const passCount = passResults.reduce((sum, result) => sum + result.total, 0);
    const failCount = failResults.reduce((sum, result) => sum + result.total, 0);
    const passRate = total > 0 ? ((passCount / total) * 100).toFixed(1) : 0;

    return { total, passCount, failCount, passRate };
  }, [filteredResults]);

  // Export functionality
  const handleExport = () => {
    try {
      const csvContent = [
        ["Score", "Count", "Percentage"].join(","),
        ...chartData.map((row) => [
          row.name,
          row.value,
          ((row.value / summaryStats.total) * 100).toFixed(2) + "%",
        ]),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `exam_results_pie_chart_${new Date().toISOString().split("T")[0]}.csv`;
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
    setCadreSearchTerm("");
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const percentage =
        summaryStats.total > 0 ? ((dataPoint.value / summaryStats.total) * 100).toFixed(1) : "0";
      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: `2px solid ${dataPoint.color}`,
            borderRadius: 1,
            padding: 1.5,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: dataPoint.color }}>
            {dataPoint.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Count: {dataPoint.value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Percentage: {percentage}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        payload: PropTypes.shape({
          name: PropTypes.string,
          value: PropTypes.number,
          color: PropTypes.string,
        }),
      })
    ),
  };

  const CustomLegend = ({ payload }) => {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 2 }}>
        {payload &&
          payload.map((entry, index) => (
            <Chip
              key={index}
              label={`${entry.value}: ${entry.payload.value.toLocaleString()}`}
              sx={{
                backgroundColor: entry.color,
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
              size="small"
            />
          ))}
      </Box>
    );
  };

  CustomLegend.propTypes = {
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        color: PropTypes.string,
        payload: PropTypes.shape({
          value: PropTypes.number,
        }),
      })
    ),
  };

  if (!data || !data.data) {
    return (
      <Card sx={{ p: 3, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>
          Exam Results Distribution
        </Typography>
        <Typography color="text.secondary">No exam results data available</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, boxShadow: 2 }}>
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Exam Results Distribution by Overall Score
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
                {periods.map((period) => (
                  <MenuItem key={period} value={period}>
                    {period}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              value={selectedCadre === "ALL" ? null : selectedCadre}
              onChange={(event, newValue) => {
                setSelectedCadre(newValue || "ALL");
              }}
              inputValue={cadreSearchTerm}
              onInputChange={(event, newInputValue) => {
                setCadreSearchTerm(newInputValue);
              }}
              options={["ALL", ...filteredCadres]}
              getOptionLabel={(option) =>
                option === "ALL"
                  ? "All Cadres"
                  : option.length > 50
                  ? `${option.substring(0, 50)}...`
                  : option
              }
              renderInput={(params) => (
                <TextField {...params} label="Cadre" size="small" placeholder="Search cadres..." />
              )}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              startIcon={<FileDownload style={{ color: "red" }} />}
              onClick={handleExport}
              size="small"
              variant="outlined"
              disabled={chartData.length === 0}
            >
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
          {(selectedPeriod !== "ALL" || selectedCadre !== "ALL") && (
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
      {chartData.length > 0 ? (
        <Box sx={{ height: 400, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 5 ? `${name} ${(percent * 100).toFixed(1)}%` : ""
                }
                outerRadius={120}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", py: 4, backgroundColor: "grey.50", borderRadius: 1 }}>
          <Typography color="text.secondary" variant="h6">
            No data available for the selected filters
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            Try adjusting your filter criteria
          </Typography>
        </Box>
      )}

      {/* Additional Summary */}
      <Box display="grid" gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }} gap={2}>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Periods Covered
          </Typography>
          <Typography variant="body1">{periods.length}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Unique Cadres
          </Typography>
          <Typography variant="body1">{cadres.length}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Score Types
          </Typography>
          <Typography variant="body1">{chartData.length}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            Avg. per Period
          </Typography>
          <Typography variant="body1">
            {periods.length > 0
              ? Math.round(summaryStats.total / periods.length).toLocaleString()
              : 0}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

ExamPieChart.propTypes = {
  data: PropTypes.shape({
    indicator: PropTypes.string,
    data: PropTypes.object,
  }),
};

export default ExamPieChart;
