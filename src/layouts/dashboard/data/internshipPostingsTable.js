"use client";
import PropTypes from "prop-types";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import { useState, useMemo, useCallback } from "react";
import { Search, Download, TrendingUp, LocationOn, FilterList } from "@mui/icons-material";
import { formatNumberWithCommas } from "utils/formatNumber";

// Region categorization helper function
const categorizeRegion = (centerName) => {
  const name = centerName.toLowerCase();

  if (name.includes("nairobi") || name.includes("kenyatta")) return "Nairobi";
  if (name.includes("mombasa") || name.includes("coast")) return "Coast";
  if (name.includes("nakuru") || name.includes("nyeri")) return "Central";
  if (name.includes("kisumu") || name.includes("kakamega")) return "Western";
  if (name.includes("meru") || name.includes("embu")) return "Eastern";
  if (name.includes("garissa") || name.includes("isiolo")) return "North Eastern";

  return "Other";
};

// Main component
function InternshipPostingsTable({ data }) {
  // State management
  const [filters, setFilters] = useState({
    year: "ALL",
    region: "ALL",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
  });
  const [sorting, setSorting] = useState({
    field: "total",
    order: "desc",
  });

  // Data processing and filtering
  const processedData = useMemo(() => {
    if (!data?.data) {
      return {
        years: [],
        regions: [],
        tableData: [],
        summary: {
          totalPostings: 0,
          totalCenters: 0,
          totalYears: 0,
          totalRegions: 0,
          averagePerCenter: 0,
        },
      };
    }

    const allYears = Object.keys(data.data).sort();
    const allRegions = new Set();
    const rawTableData = [];

    // Extract and transform data
    Object.entries(data.data).forEach(([year, centers]) => {
      Object.entries(centers).forEach(([centerKey, centerData]) => {
        const centerName = centerData.InternshipCenter || "Unknown Center";
        const total = Number.parseInt(centerData.Total) || 0;
        const region = categorizeRegion(centerName);

        allRegions.add(region);
        rawTableData.push({
          id: `${year}-${centerKey}`,
          year,
          centerName,
          total,
          region,
        });
      });
    });

    // Apply filters
    const filteredData = rawTableData.filter((item) => {
      const yearMatch = filters.year === "ALL" || item.year === filters.year;
      const regionMatch = filters.region === "ALL" || item.region === filters.region;
      const searchMatch =
        filters.search === "" ||
        item.centerName.toLowerCase().includes(filters.search.toLowerCase());

      return yearMatch && regionMatch && searchMatch;
    });

    // Apply sorting
    const sortedData = [...filteredData].sort((a, b) => {
      let aValue, bValue;

      switch (sorting.field) {
        case "center":
          aValue = a.centerName.toLowerCase();
          bValue = b.centerName.toLowerCase();
          break;
        case "year":
          aValue = a.year;
          bValue = b.year;
          break;
        case "region":
          aValue = a.region;
          bValue = b.region;
          break;
        case "total":
        default:
          aValue = a.total;
          bValue = b.total;
          break;
      }

      if (sorting.order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate summary statistics
    const uniqueCenters = new Set(filteredData.map((item) => item.centerName));
    const summary = {
      totalPostings: filteredData.reduce((sum, item) => sum + item.total, 0),
      totalCenters: uniqueCenters.size,
      totalYears: new Set(filteredData.map((item) => item.year)).size,
      totalRegions: new Set(filteredData.map((item) => item.region)).size,
      averagePerCenter:
        uniqueCenters.size > 0
          ? Math.round(filteredData.reduce((sum, item) => sum + item.total, 0) / uniqueCenters.size)
          : 0,
    };

    return {
      years: allYears,
      regions: Array.from(allRegions).sort(),
      tableData: sortedData,
      summary,
    };
  }, [data, filters, sorting]);

  // Event handlers
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setPagination((prev) => ({ ...prev, page: 0 })); // Reset to first page
  }, []);

  const handleSortChange = useCallback((field) => {
    setSorting((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
  }, []);

  const handlePageChange = useCallback((event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setPagination({
      page: 0,
      rowsPerPage: Number.parseInt(event.target.value, 10),
    });
  }, []);

  const handleExport = useCallback(() => {
    try {
      const csvContent = [
        ["Year", "Internship Center", "Region", "Total Postings"],
        ...processedData.tableData.map((row) => [
          row.year,
          `"${row.centerName}"`, // Wrap in quotes to handle commas
          row.region,
          row.total,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `internship_postings_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [processedData.tableData]);

  const clearFilters = useCallback(() => {
    setFilters({ year: "ALL", region: "ALL", search: "" });
    setPagination({ page: 0, rowsPerPage: 10 });
  }, []);

  // Get paginated data
  const paginatedData = processedData.tableData.slice(
    pagination.page * pagination.rowsPerPage,
    pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
  );

  // Render sort indicator
  const getSortIndicator = (field) => {
    if (sorting.field !== field) return "";
    return sorting.order === "asc" ? " ↑" : " ↓";
  };

  // No data state
  if (!data?.data || Object.keys(data.data).length === 0) {
    return (
      <Card sx={{ p: 3, boxShadow: 2 }}>
        <Alert severity="info">
          No internship postings data available. Please check your data source.
        </Alert>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, boxShadow: 2 }}>
      {/* Header Section */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Internship Postings by Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comprehensive view of internship center allocations across Kenya
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Clear all filters">
              <IconButton onClick={clearFilters} color="secondary">
                <FilterList />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export to CSV">
              <IconButton onClick={handleExport} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filters Section */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={filters.year}
                label="Year"
                onChange={(e) => handleFilterChange("year", e.target.value)}
              >
                <MenuItem value="ALL">All Years</MenuItem>
                {processedData.years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select
                value={filters.region}
                label="Region"
                onChange={(e) => handleFilterChange("region", e.target.value)}
              >
                <MenuItem value="ALL">All Regions</MenuItem>
                {processedData.regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search internship centers..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Active Filters */}
        {(filters.year !== "ALL" || filters.region !== "ALL" || filters.search) && (
          <Box sx={{ mb: 2 }}>
            {filters.year !== "ALL" && (
              <Chip
                label={`Year: ${filters.year}`}
                onDelete={() => handleFilterChange("year", "ALL")}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {filters.region !== "ALL" && (
              <Chip
                label={`Region: ${filters.region}`}
                onDelete={() => handleFilterChange("region", "ALL")}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {filters.search && (
              <Chip
                label={`Search: ${filters.search}`}
                onDelete={() => handleFilterChange("search", "")}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            )}
          </Box>
        )}

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="primary.light" borderRadius={1}>
              <Typography variant="h6" color="primary.contrastText">
                {formatNumberWithCommas(processedData.summary.totalPostings)}
              </Typography>
              <Typography variant="caption" color="primary.contrastText">
                Total Postings
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={1}>
              <Typography variant="h6" color="success.contrastText">
                {processedData.summary.totalCenters}
              </Typography>
              <Typography variant="caption" color="success.contrastText">
                Centers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={1}>
              <Typography variant="h6" color="info.contrastText">
                {processedData.summary.totalRegions}
              </Typography>
              <Typography variant="caption" color="info.contrastText">
                Regions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={1}>
              <Typography variant="h6" color="warning.contrastText">
                {formatNumberWithCommas(processedData.summary.averagePerCenter)}
              </Typography>
              <Typography variant="caption" color="warning.contrastText">
                Avg/Center
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="internship postings table">
          <TableBody>
            {/* Header Row */}
            <TableRow
              sx={{
                backgroundColor: "#f5f5f5",
                position: "sticky",
                top: 0,
                zIndex: 1,
                "& th": {
                  fontWeight: "bold",
                },
              }}
            >
              <TableCell
                component="th"
                scope="col"
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => handleSortChange("year")}
              >
                Year{getSortIndicator("year")}
              </TableCell>
              <TableCell
                component="th"
                scope="col"
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => handleSortChange("center")}
              >
                Internship Center{getSortIndicator("center")}
              </TableCell>
              <TableCell
                component="th"
                scope="col"
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => handleSortChange("region")}
              >
                <Box display="flex" alignItems="center">
                  <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                  Region{getSortIndicator("region")}
                </Box>
              </TableCell>
              <TableCell
                component="th"
                scope="col"
                align="right"
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => handleSortChange("total")}
              >
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                  Total Postings{getSortIndicator("total")}
                </Box>
              </TableCell>
            </TableRow>

            {/* Data Rows */}
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:nth-of-type(even)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#e3f2fd" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell>
                    <Chip label={row.year} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={row.centerName}
                    >
                      {row.centerName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.region}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      icon={<LocationOn fontSize="small" />}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatNumberWithCommas(row.total)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No data matches your current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={processedData.tableData.length}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        showFirstButton
        showLastButton
      />
    </Card>
  );
}

// PropTypes validation
InternshipPostingsTable.propTypes = {
  data: PropTypes.shape({
    indicator: PropTypes.string,
    data: PropTypes.object,
  }),
};

// Default props
InternshipPostingsTable.defaultProps = {
  data: {
    indicator: "",
    data: {},
  },
};

export default InternshipPostingsTable;
