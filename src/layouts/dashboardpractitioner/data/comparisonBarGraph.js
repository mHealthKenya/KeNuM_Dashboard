// Separate datasets for registration and license
export const registrationData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: {
    label: "Registrations",
    data: [120, 190, 130, 170, 160, 150, 180, 170, 160, 190, 200, 210],
    backgroundColor: "rgba(54, 162, 235, 0.5)",
  },
};

export const licenseData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: {
    label: "Licenses",
    data: [90, 120, 100, 140, 130, 110, 150, 140, 130, 160, 170, 180],
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  },
};

// For backward compatibility
const licenseRegistrationBarChartData = {
  labels: registrationData.labels,
  datasets: [registrationData.datasets, licenseData.datasets],
};

export default licenseRegistrationBarChartData;
