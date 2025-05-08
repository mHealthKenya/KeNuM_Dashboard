import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";

// Import the FAQ service
import { getAllFaqs } from "services/faq/faqService";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function FAQView() {
  const [faqItems, setFaqItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">All FAQs</MDTypography>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                {faqItems.length === 0 && !errorMessage && (
                  <MDTypography variant="body2" mt={2}>
                    No FAQs available.
                  </MDTypography>
                )}

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
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FAQView;
