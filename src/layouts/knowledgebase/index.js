import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Knowledgebase() {
  // Mock educational articles
  const articles = [
    {
      title: "Getting Started with Our Platform",
      content:
        "Learn the basics of navigating and utilizing our platform effectively for nursing and midwifery education...",
      downloadLink: "/downloads/getting-started-guide.pdf",
    },
    {
      title: "Advanced Features and Tips",
      content:
        "Discover advanced features that help you maximize efficiency in your nursing practice...",
      downloadLink: "/downloads/advanced-features-guide.pdf",
    },
    {
      title: "Security Best Practices",
      content:
        "Ensure your account safety with these essential security tips for healthcare professionals...",
      downloadLink: "/downloads/security-best-practices.pdf",
    },
    {
      title: "Essential Nursing Skills",
      content:
        "Explore fundamental nursing skills and techniques that every nurse should master...",
      downloadLink: "/downloads/essential-nursing-skills.pdf",
    },
    {
      title: "Midwifery Practices and Protocols",
      content:
        "Gain insights into essential midwifery practices and the latest protocols for maternal care...",
      downloadLink: "/downloads/midwifery-practices.pdf",
    },
    {
      title: "Patient Communication Strategies",
      content:
        "Learn effective communication strategies for interacting with patients and their families...",
      downloadLink: "/downloads/patient-communication-strategies.pdf",
    },
    {
      title: "Medication Administration Guidelines",
      content:
        "Understand the guidelines for safe and effective medication administration in nursing...",
      downloadLink: "/downloads/medication-administration-guidelines.pdf",
    },
    {
      title: "Understanding Patient Rights",
      content: "Educate yourself about patient rights and ethical considerations in healthcare...",
      downloadLink: "/downloads/patient-rights.pdf",
    },
    {
      title: "Mental Health Awareness in Nursing",
      content:
        "Explore the importance of mental health awareness and support in nursing practice...",
      downloadLink: "/downloads/mental-health-awareness.pdf",
    },
    {
      title: "Evidence-Based Practice in Nursing",
      content:
        "Discover how to incorporate evidence-based practice into your nursing care plans...",
      downloadLink: "/downloads/evidence-based-practice.pdf",
    },
  ];
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Knowledge Base</MDTypography>
                <MDTypography variant="body2" color="text">
                  Discover articles and guides across various fields of study to expand your
                  knowledge. Each section includes content for in-depth review.
                </MDTypography>
              </MDBox>

              {/* Educational Articles Section */}
              <MDBox pt={2} px={2}>
                {articles.map((article, index) => (
                  <Card key={index} style={{ marginBottom: "15px" }}>
                    <MDBox p={2}>
                      <MDTypography variant="h6">{article.title}</MDTypography>
                      <MDTypography variant="body2" color="text" fontWeight="regular">
                        {article.content}
                      </MDTypography>
                      <MDBox mt={1} display="flex" justifyContent="flex-end">
                        <IconButton
                          color="primary"
                          component="a"
                          href={article.downloadLink}
                          download
                        >
                          <DownloadIcon /> {/* Download Icon */}
                          <MDTypography variant="body2" color="text">
                            Download
                          </MDTypography>
                        </IconButton>
                      </MDBox>
                    </MDBox>
                  </Card>
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

export default Knowledgebase;
