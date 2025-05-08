import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Import the FAQ service
import { addFaq } from "services/faq/faqService";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function FAQ() {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddFaq = async () => {
    if (!newQuestion || !newAnswer) {
      setErrorMessage("Both question and answer are required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const createdById = localStorage.getItem("userId");

      if (!createdById) {
        throw new Error("User ID is missing. Cannot add FAQ.");
      }

      const newFaq = { question: newQuestion, answer: newAnswer, createdById };
      await addFaq(newFaq);

      setNewQuestion("");
      setNewAnswer("");
      setSuccessMessage("FAQ added successfully!");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card style={{ marginBottom: "20px" }}>
              <MDBox p={2}>
                <MDTypography variant="h6">Add a New FAQ</MDTypography>

                {/* Show Success or Error Message */}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <TextField
                  fullWidth
                  label="Question"
                  variant="outlined"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
                <TextField
                  fullWidth
                  label="Answer"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddFaq}
                  style={{ color: "white" }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Add FAQ"}
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

export default FAQ;
