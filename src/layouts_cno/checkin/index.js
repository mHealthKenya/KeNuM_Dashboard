import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import checkInReportsData from "layouts_cno/checkin/data/checkInReportsData";

function Tables() {
  const { columns: checkInColumns, rows: checkInRows, downloadCSV } = checkInReportsData();

  // Custom Cell Renderer for Status
  const customStatusCell = ({ row }) => {
    const statusColor = row.original.statusColor;
    return <span style={{ color: statusColor, fontWeight: "bold" }}>{row.values.status}</span>;
  };

  customStatusCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.shape({
        statusColor: PropTypes.string.isRequired,
      }).isRequired,
      values: PropTypes.shape({
        status: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  // Update columns to use custom status cell renderer
  const customColumns = checkInColumns.map((col) => {
    if (col.accessor === "status") {
      return {
        ...col,
        Cell: customStatusCell, // Use custom cell for the status column
      };
    }
    return col;
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Check-In Reports
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: customColumns, // Pass the custom columns with status color
                    rows: checkInRows,
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              <MDBox px={2} py={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={downloadCSV}
                  style={{ marginRight: "10px", color: "white" }}
                >
                  Download CSV
                </Button>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
