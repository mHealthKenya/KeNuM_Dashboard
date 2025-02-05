import React, { useState } from "react";
import DataTable from "examples/Tables/DataTable"; // Import your table component
import data from "./authorsTableData"; // Import the data function
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";

export default function MainComponent() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Open modal and set selected row data
  const handleEditClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  // Handle form input change
  const handleChange = (event) => {
    setSelectedRow({
      ...selectedRow,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Updated Data:", selectedRow);
    handleClose();
  };

  const tableData = data(handleEditClick); // Pass edit function to table

  return (
    <MDBox>
      <DataTable table={tableData} />

      {/* Edit Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Details</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <MDBox component="form" p={2}>
              <TextField
                fullWidth
                margin="dense"
                label="Name"
                name="name"
                value={selectedRow.name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Email"
                name="email"
                value={selectedRow.email}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Contact"
                name="contact"
                value={selectedRow.contact}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Facility"
                name="facility"
                value={selectedRow.facility}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="County"
                name="county"
                value={selectedRow.county}
                onChange={handleChange}
              />
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}
