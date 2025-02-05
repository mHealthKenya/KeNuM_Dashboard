import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function FAQ() {
  const [faqItems, setFaqItems] = useState([
    {
      question: "How can I update my profile information?",
      answer:
        "To update your profile, go to the settings page, select 'Edit Profile,' and make any changes you'd like. Remember to save your updates.",
    },
    {
      question: "What should I do if I encounter technical issues?",
      answer:
        "If you experience any technical difficulties, please visit our support page or contact us directly at techsupport@example.com.",
    },
    {
      question: "Where can I review the terms and conditions?",
      answer:
        "You can view our terms and conditions at the footer of each page or by visiting https://osp.nckenya.go.ke/.",
    },
    {
      question: "Is it possible to cancel my subscription?",
      answer:
        "Yes, you can cancel your subscription at any time from your account settings under 'Manage Subscription'.",
    },

    {
      question: "How do I upgrade my subscription plan?",
      answer:
        "To upgrade, visit the 'Subscription' section in your account settings and select the plan you'd like to upgrade to. Follow the instructions provided.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept major credit cards, debit cards, and PayPal. Additional payment options may be available depending on your region.",
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddFaq = () => {
    if (newQuestion && newAnswer) {
      setFaqItems([{ question: newQuestion, answer: newAnswer }, ...faqItems]);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            {/* Add New FAQ Section at the Top */}
            <Card style={{ marginBottom: "20px" }}>
              <MDBox p={2}>
                <MDTypography variant="h6">Add a New FAQ</MDTypography>
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
                >
                  Add FAQ
                </Button>
              </MDBox>
            </Card>

            {/* FAQ List Section */}
            <Card style={{ marginBottom: "20px" }}>
              <MDBox p={2}>
                <MDTypography variant="h5">Frequently Asked Questions</MDTypography>
                <MDTypography variant="body2" color="text" fontWeight="regular">
                  Here are some of the most common questions and answers.
                </MDTypography>
              </MDBox>
              <MDBox pt={2} px={2} p={2}>
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
                      <br />
                    </AccordionDetails>
                  </Accordion>
                ))}
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
