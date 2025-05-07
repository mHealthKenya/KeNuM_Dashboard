import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Modal, CardContent, Typography } from "@mui/material";

// Import services
import { getAllCategories, addArticle, addCategory } from "services/knowledgebase/knowbaseService";

// MD components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function KnowledgebaseAdd() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleFile, setNewArticleFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // Fetch Categories from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = await getAllCategories();
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
      if (file.type !== "application/pdf") {
        alert("Please upload only PDF files");
        event.target.value = "";
        setSelectedFileName(null);
        setNewArticleFile(null);
        return;
      }
      setNewArticleFile(file);
      setSelectedFileName(file.name);
    }
  };

  // Handle Add Category
  const handleAddCategory = async () => {
    if (!newCategoryTitle.trim()) {
      setCategoryError("Category title is required.");
      return;
    }
    try {
      setCategoryError("");
      setSuccess("");
      setLoading(true);
      const categoryData = {
        title: newCategoryTitle,
        createdById: "20946634-166e-4d43-ba12-e2eb1578fd60",
      };
      const newCategory = await addCategory(categoryData);
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryTitle("");
      setIsCategoryModalOpen(false);
      setSuccess("Category added successfully!");
    } catch (err) {
      setCategoryError(err.message || "Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Article
  const handleAddArticle = async () => {
    if (!newArticleTitle.trim() || !newArticleFile || !selectedCategory) {
      setError("Please provide a title, file, and select a category.");
      return;
    }
    try {
      setError("");
      setSuccess("");
      setLoading(true);
      const createdById = localStorage.getItem("userId");
      await addArticle(newArticleTitle, newArticleFile, selectedCategory, createdById);
      setSuccess("Article uploaded successfully!");
      setNewArticleTitle("");
      setNewArticleFile(null);
      setSelectedCategory("");
      setSelectedFileName(null);
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
            <Card>
              <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6">Add New Article</MDTypography>
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

              <MDBox p={2}>
                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
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
                      <span style={{ color: "black" }}>Upload PDF File</span>
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept=".pdf,application/pdf"
                      />
                    </Button>
                    {selectedFileName && (
                      <MDTypography variant="body2" color="text.secondary" mt={1}>
                        Selected File: {selectedFileName}
                      </MDTypography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ minHeight: 10 }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        sx={{ height: 56 }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
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
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {/* Category Modal */}
      <Modal open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
        <Card
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
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

export default KnowledgebaseAdd;
