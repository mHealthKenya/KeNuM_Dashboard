import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Knowledgebase() {
  // Initial articles list
  const [articles, setArticles] = useState([
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
  ]);

  // State for new article form
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleDescription, setNewArticleDescription] = useState("");
  const [newArticleFile, setNewArticleFile] = useState(null);

  // Handle file input
  const handleFileChange = (event) => {
    setNewArticleFile(event.target.files[0]);
  };

  // Handle adding new article
  const handleAddArticle = () => {
    if (newArticleTitle && newArticleFile) {
      const newArticle = {
        title: newArticleTitle,
        content: newArticleDescription || "No description provided.",
        downloadLink: URL.createObjectURL(newArticleFile),
      };
      setArticles((prevArticles) => [...prevArticles, newArticle]);
      setNewArticleTitle("");
      setNewArticleDescription("");
      setNewArticleFile(null);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            {/* Card for Adding New Article */}
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h6">Add New Article</MDTypography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Article Title"
                      fullWidth
                      value={newArticleTitle}
                      onChange={(e) => setNewArticleTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      style={{ color: "black" }} // Set text color to black
                    >
                      Upload File
                      <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Article Description"
                      fullWidth
                      multiline
                      rows={4}
                      value={newArticleDescription}
                      onChange={(e) => setNewArticleDescription(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddArticle}
                      style={{ color: "white" }}
                    >
                      Add Article
                    </Button>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>

            {/* Cards for Existing Articles */}
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
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Knowledgebase;
