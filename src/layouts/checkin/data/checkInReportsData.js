import { saveAs } from "file-saver";
import jsPDF from "jspdf";
// import "jspdf-autotable";

export default function checkInReportsData() {
  const columns = [
    { Header: "Date", accessor: "date", width: "15%", align: "left" },
    { Header: "Student", accessor: "supervisor", width: "20%", align: "left" },
    { Header: "Location", accessor: "location", width: "20%", align: "left" },
    { Header: "Status", accessor: "status", width: "15%", align: "center" },
    { Header: "Comments", accessor: "comments", width: "30%", align: "left" },
  ];

  const rows = [
    {
      date: "2024-11-01",
      supervisor: "John Doe",
      location: "Facility A",
      status: "Checked Out",
      statusColor: "#28a745", // Green for Checked Out
      comments: "All tasks completed on time.",
    },
    {
      date: "2024-11-02",
      supervisor: "Jane Smith",
      location: "Facility B",
      status: "In Progress",
      statusColor: "#007bff", // Blue for In Progress
      comments: "Pending final checks.",
    },
    {
      date: "2024-11-03",
      supervisor: "Alice Johnson",
      location: "Facility C",
      status: "Delayed",
      statusColor: "#FF0000", // Red for Delayed
      comments: "Delay due to equipment issue.",
    },
    {
      date: "2024-11-04",
      supervisor: "Tom Brown",
      location: "Facility D",
      status: "Checked Out",
      statusColor: "#28a745", // Green for Checked Out
      comments: "Successfully completed all tasks.",
    },
    {
      date: "2024-11-05",
      supervisor: "Emily Davis",
      location: "Facility E",
      status: "In Progress",
      statusColor: "#007bff", // Blue for In Progress
      comments: "Awaiting supervisor review.",
    },
    {
      date: "2024-11-06",
      supervisor: "Michael White",
      location: "Facility F",
      status: "Checked Out",
      statusColor: "#28a745", // Green for Checked Out
      comments: "Everything was completed ahead of schedule.",
    },
    {
      date: "2024-11-07",
      supervisor: "Sarah Wilson",
      location: "Facility G",
      status: "Delayed",
      statusColor: "#FF0000", // Red for Delayed
      comments: "Issues with documentation delay.",
    },
    {
      date: "2024-11-08",
      supervisor: "David Harris",
      location: "Facility H",
      status: "Checked Out",
      statusColor: "#28a745", // Green for Checked Out
      comments: "All activities successfully concluded.",
    },
    {
      date: "2024-11-09",
      supervisor: "Olivia Clark",
      location: "Facility I",
      status: "In Progress",
      statusColor: "#007bff", // Blue for In Progress
      comments: "Work in progress, pending inspections.",
    },
    {
      date: "2024-11-10",
      supervisor: "Liam Lewis",
      location: "Facility J",
      status: "Checked Out",
      statusColor: "#28a745", // Green for Checked Out
      comments: "Completed tasks on time with no issues.",
    },
    {
      date: "2024-11-11",
      supervisor: "Sophia Walker",
      location: "Facility K",
      status: "Delayed",
      statusColor: "#FF0000", // Red for Delayed
      comments: "Delay due to staff shortage.",
    },
  ];

  // Function to download data as CSV
  const downloadCSV = () => {
    const csvContent = [
      columns.map((col) => col.Header).join(","),
      ...rows.map((row) => columns.map((col) => row[col.accessor]).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "CheckInReports.csv");
  };

  // Function to print data as PDF
  const printPDF = () => {
    const doc = new jsPDF();
    doc.text("Check-In Reports", 10, 10);
    doc.autoTable({
      head: [columns.map((col) => col.Header)],
      body: rows.map((row) => {
        return columns.map((col) => {
          if (col.accessor === "status") {
            // Apply color to status based on `statusColor`
            return `<span style="color:${row.statusColor};">${row[col.accessor]}</span>`;
          }
          return row[col.accessor];
        });
      }),
    });
    doc.save("CheckInReports.pdf");
  };

  return { columns, rows, downloadCSV, printPDF };
}
