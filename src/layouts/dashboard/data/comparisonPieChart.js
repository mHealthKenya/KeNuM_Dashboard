const activeInactiveLicensesPieChartData = {
  labels: ["Active Licenses", "Inactive Licenses"],
  datasets: [
    {
      data: [350, 150], // Adjust these values based on actual data
      backgroundColor: ["rgba(34, 162, 85, 0.7)", "rgba(233, 19, 65, 0.7)"],
      hoverBackgroundColor: ["rgba(112, 232, 160, 0.7)", "rgba(255, 99, 132, 1)"],
    },
  ],
};

export default activeInactiveLicensesPieChartData;
