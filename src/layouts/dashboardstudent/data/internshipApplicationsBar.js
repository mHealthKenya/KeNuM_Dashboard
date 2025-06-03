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
import { Card, Typography, Box } from "@mui/material";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InternshipApplicationsBarGraph({ data }) {
  // Transform the API data into Chart.js format
  const transformDataToChartFormat = (apiData) => {
    if (!apiData || !apiData.data) {
      return {
        labels: [],
        datasets: [
          {
            label: "Internship Applications",
            data: [],
            backgroundColor: "rgba(33, 150, 243, 0.6)",
            borderColor: "rgba(33, 150, 243, 1)",
            borderWidth: 1,
          },
        ],
      };
    }

    // Extract years and totals from API data
    const years = Object.keys(apiData.data).sort();
    const applicationCounts = years.map((year) => Number.parseInt(apiData.data[year].Total));

    return {
      labels: years,
      datasets: [
        {
          label: "Internship Applications",
          data: applicationCounts,
          backgroundColor: "rgba(33, 150, 243, 0.6)",
          borderColor: "rgba(33, 150, 243, 1)",
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  };

  const chartData = transformDataToChartFormat(data);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`,
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
      },
    },
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!chartData.datasets[0].data.length) {
      return {
        total: 0,
        average: 0,
        peakYear: "",
        peakValue: 0,
        growth: 0,
      };
    }

    const dataPoints = chartData.datasets[0].data;
    const labels = chartData.labels;
    const total = dataPoints.reduce((sum, value) => sum + value, 0);
    const average = Math.round(total / dataPoints.length);

    // Find peak
    let peakIndex = 0;
    let peakValue = dataPoints[0];
    dataPoints.forEach((value, index) => {
      if (value > peakValue) {
        peakValue = value;
        peakIndex = index;
      }
    });

    // Calculate growth (first year to last year)
    const firstValue = dataPoints[0];
    const lastValue = dataPoints[dataPoints.length - 1];
    const growth = firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

    return {
      total,
      average,
      peakYear: labels[peakIndex],
      peakValue,
      growth,
    };
  };

  const stats = calculateStats();

  return (
    <Card sx={{ p: 3, boxShadow: 2 }}>
      <Box mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Internship Applications by Year
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total internship applications received from 2019-2025
        </Typography>
      </Box>

      <Box sx={{ height: 400, mb: 3 }}>
        <Bar data={chartData} options={options} />
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }} gap={2}>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="primary" fontWeight="bold">
            Peak Year
          </Typography>
          <Typography variant="body2">
            {stats.peakYear} ({stats.peakValue.toLocaleString()})
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="success.main" fontWeight="bold">
            Growth
          </Typography>
          <Typography variant="body2">
            {stats.growth}% since {chartData.labels[0]}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="body2">{stats.total.toLocaleString()}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="subtitle2" color="warning.main" fontWeight="bold">
            Average
          </Typography>
          <Typography variant="body2">{stats.average.toLocaleString()}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

// Add prop validation
InternshipApplicationsBarGraph.propTypes = {
  data: PropTypes.shape({
    indicator: PropTypes.string,
    data: PropTypes.object,
  }),
};

// Default props
InternshipApplicationsBarGraph.defaultProps = {
  data: {
    indicator: "",
    data: {},
  },
};

export default InternshipApplicationsBarGraph;
