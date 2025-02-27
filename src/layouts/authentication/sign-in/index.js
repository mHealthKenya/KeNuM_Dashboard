import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "services/auth/authService";

// MUI Components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      // Await the response from AuthService.login
      const response = await AuthService.login(email, password);

      // Ensure response contains necessary data
      if (!response || !response.token || !response.user.role) {
        throw new Error("Invalid response from server. Please try again.");
      }

      // Store auth token and role
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("userId", response.user.id);
      window.dispatchEvent(new Event("storage"));

      // Confirm the role before redirecting
      const confirmedRole = response.user.role;

      // Redirect based on confirmed user role
      switch (confirmedRole) {
        case "Admin":
          navigate("/admin-dashboard"); // Adjust the route as needed
          break;
        case "CNO":
          navigate("/cno-dashboard"); // Adjust the route as needed
          break;
        default:
          navigate("/dashboard"); // Default dashboard for other roles
      }
    } catch (err) {
      setError(err.message || "Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-5}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={4}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            {/* Email Input */}
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
              />
            </MDBox>

            {/* Password Input */}
            <MDBox mb={2}>
              <MDInput
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* Properly spaced error message */}
              {error && (
                <FormHelperText error sx={{ mt: 1, fontSize: "0.875rem" }}>
                  {error}
                </FormHelperText>
              )}
            </MDBox>

            {/* Remember Me */}
            <MDBox display="flex" alignItems="center" ml={-1} mb={2}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>

            {/* Sign In Button */}
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
              </MDButton>
            </MDBox>

            {/* Forgot Password */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDBox textAlign="left">
                <MDTypography variant="button" color="text">
                  <MDTypography
                    component="a"
                    href="https://osp.nckenya.go.ke/password"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Forgot Password?
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
