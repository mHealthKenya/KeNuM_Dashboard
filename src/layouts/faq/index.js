import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Import the FAQ service
import { getAllFaqs, addFaq } from "services/faq/faqService";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function FAQ() {
  const [tabIndex, setTabIndex] = useState(0);
  const [faqItems, setFaqItems] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getAllFaqs();
        setFaqItems(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchFaqs();
  }, []);

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
      const addedFaq = await addFaq(newFaq);

      setFaqItems([addedFaq, ...faqItems]);
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
            <Card>
              <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)}>
                <Tab label="Add FAQ" />
                <Tab label="All FAQs" />
              </Tabs>
            </Card>

            {/* Add FAQ Tab */}
            {tabIndex === 0 && (
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
            )}

            {/* All FAQs Tab */}
            {tabIndex === 1 && (
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h5">All FAQs</MDTypography>
                  {faqItems.length === 0 && <MDTypography>No FAQs available.</MDTypography>}
                  {faqItems.map((item, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <MDTypography variant="body1" fontWeight="medium">
                          {item.question}
                        </MDTypography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <MDTypography variant="body2" color="text">
                          {item.answer}
                        </MDTypography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </MDBox>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FAQ;
