"use client";

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
// import Modal from "@mui/material/Modal";
import { Modal, CardContent, Typography } from "@mui/material";

// Import Knowledgebase service
import {
  getAllArticles,
  getAllCategories,
  addArticle,
  addCategory,
} from "services/knowledgebase/knowbaseService";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Knowledgebase() {
  const [tabIndex, setTabIndex] = useState(0);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add article form states
  const [newArticleTitle, setNewArticleTitle] = useState("");
  // const [newArticleDescription, setNewArticleDescription] = useState("");
  const [newArticleFile, setNewArticleFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [categoryError, setCategoryError] = useState("");

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
  }, [success]);

  // Handle File Change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewArticleFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryTitle.trim()) {
      setCategoryError("Category title is required.");
      return;
    }

    try {
      setCategoryError("");
      setSuccess(""); // Clear previous success message
      setLoading(true);

      // Construct the request payload
      const categoryData = {
        title: newCategoryTitle,
        createdById: "20946634-166e-4d43-ba12-e2eb1578fd60",
      };

      // Call API to add category
      const newCategory = await addCategory(categoryData); // Ensure `addCategory` accepts an object

      // Update category state
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategoryTitle("");
      setIsCategoryModalOpen(false);
      setSuccess("Category added successfully!");
    } catch (err) {
      setCategoryError(err.message || "Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Adding a New Article
  // Assume you have a way to get the current user ID (e.g., from auth context)
  const createdById = localStorage.getItem("userId");

  // Handle Adding a New Article
  const handleAddArticle = async () => {
    if (!newArticleTitle.trim() || !newArticleFile || !selectedCategory) {
      setError("Please provide a title, file, and select a category.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const newArticle = await addArticle(
        newArticleTitle,
        // newArticleDescription,
        newArticleFile,
        selectedCategory,
        createdById
      );

      // Add new article to the list
      setArticles((prevArticles) => [...prevArticles, newArticle]);

      // Show success message
      setSuccess("Article uploaded successfully!");

      // Reset form fields
      setNewArticleTitle("");
      // setNewArticleDescription("");
      setNewArticleFile(null);
      setSelectedCategory("");

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add article.");
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
            {/* Tabs for switching between views */}
            <Card>
              <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)}>
                <Tab label="Add Knowledgebase" />
                <Tab label="All Articles" />
              </Tabs>
            </Card>

            {/* Add Knowledgebase Tab */}
            {tabIndex === 0 && (
              <Card>
                {/* Header Section */}
                <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6">Add New Article</MDTypography>

                  {/* Button at the top right */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setIsCategoryModalOpen(true)}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <span style={{ color: "white" }}>Add Category</span>
                    )}
                  </Button>
                </MDBox>

                {/* Success and error messages */}
                <MDBox p={2}>
                  {success && <Alert severity="success">{success}</Alert>}
                  {error && <Alert severity="error">{error}</Alert>}{" "}
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
                      <Button variant="outlined" component="label" fullWidth>
                        <span style={{ color: "black" }}>Upload File</span>
                        <input type="file" hidden onChange={handleFileChange} />
                      </Button>
                      {selectedFileName && (
                        <MDTypography variant="body2" color="text.secondary" mt={1}>
                          Selected File: {selectedFileName}
                        </MDTypography>
                      )}
                    </Grid>

                    {/* <Grid item xs={12}> 
                      <TextField
                        label="Article Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={newArticleDescription}
                        onChange={(e) => setNewArticleDescription(e.target.value)}
                      />
                    </Grid> */}
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ minHeight: 10 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          sx={{ height: 56 }} // Increase height
                        >
                          {categories.map((category) => (
                            <MenuItem
                              key={category.id}
                              value={category.id}
                              sx={{ fontSize: 16, padding: "12px 16px" }}
                            >
                              {category.title || "Unamed Category"}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddArticle}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <span style={{ color: "white" }}>Add Article</span>
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            )}

            {/* All Articles Tab */}
            {tabIndex === 1 && (
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
                      // Find the category that matches the article's category ID
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
            )}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Modal open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
        <Card
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#fff", // Explicit white background
            boxShadow: 24,
            borderRadius: 2,
            p: 2, // Padding
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              Add Category
            </Typography>
            {categoryError && <Alert severity="error">{categoryError}</Alert>}
            <TextField
              label="Category Title"
              fullWidth
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleAddCategory}>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <span style={{ color: "white" }}>Add</span>
              )}
            </Button>
          </CardContent>
        </Card>
      </Modal>
    </DashboardLayout>
  );
}

export default Knowledgebase;
