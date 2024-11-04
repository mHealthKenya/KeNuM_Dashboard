// layouts/rotations/data/checkInReportsData.js

// Sample columns and rows for Check-In Reports
export default function checkInReportsData() {
  const columns = [
    { Header: "Date", accessor: "date", width: "15%", align: "left" },
    { Header: "Supervisor", accessor: "supervisor", width: "20%", align: "left" },
    { Header: "Location", accessor: "location", width: "20%", align: "left" },
    { Header: "Status", accessor: "status", width: "15%", align: "center" },
    { Header: "Comments", accessor: "comments", width: "30%", align: "left" },
  ];

  const rows = [
    {
      date: "2024-11-01",
      supervisor: "John Doe",
      location: "Facility A",
      status: "Completed",
      comments: "All tasks completed on time.",
    },
    {
      date: "2024-11-02",
      supervisor: "Jane Smith",
      location: "Facility B",
      status: "In Progress",
      comments: "Pending final checks.",
    },
    {
      date: "2024-11-03",
      supervisor: "Alice Johnson",
      location: "Facility C",
      status: "Delayed",
      comments: "Delay due to equipment issue.",
    },
    // Add more rows as needed
  ];

  return { columns, rows };
}
