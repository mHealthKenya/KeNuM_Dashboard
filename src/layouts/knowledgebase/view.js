import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Import services
import { getAllArticles, getAllCategories } from "services/knowledgebase/knowbaseService";

// MD components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function KnowledgebaseView() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Articles and Categories from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articlesData, categoriesData] = await Promise.all([
          getAllArticles(),
          getAllCategories(),
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">All Articles</MDTypography>
                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}
                {!loading && !error && articles.length === 0 && (
                  <MDTypography>No articles available.</MDTypography>
                )}
                {!loading &&
                  !error &&
                  articles.map((article) => {
                    const category = categories.find(
                      (cat) => cat.id === article.knowledgeBaseCategoryId
                    );
                    const categoryName = category ? category.title : "Uncategorized";
                    return (
                      <Card key={article.id} style={{ marginBottom: "15px" }}>
                        <MDBox p={2}>
                          <MDTypography variant="h6">{article.title}</MDTypography>
                          <MDTypography variant="body2" color="text.secondary">
                            Category: {categoryName}
                          </MDTypography>
                          <MDBox mt={1} display="flex" justifyContent="flex-end">
                            <IconButton
                              color="primary"
                              component="a"
                              href={article.downloadLink}
                              download
                            >
                              <DownloadIcon />
                              <MDTypography variant="body2" color="text">
                                Download
                              </MDTypography>
                            </IconButton>
                          </MDBox>
                        </MDBox>
                      </Card>
                    );
                  })}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default KnowledgebaseView;
