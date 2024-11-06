import { saveAs } from "file-saver";
import jsPDF from "jspdf";
// import "jspdf-autotable";

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
      body: rows.map((row) => columns.map((col) => row[col.accessor])),
    });
    doc.save("CheckInReports.pdf");
  };

  return { columns, rows, downloadCSV, printPDF };
}
