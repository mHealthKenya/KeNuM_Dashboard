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
// import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import bgImage from "assets/images/NCKLogo-0000.jpg";

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
      const response = await AuthService.login(email, password);

      if (!response || !response.token || !response.user.roles?.length) {
        throw new Error("Invalid response from server. Please try again.");
      }

      const userRole = response.user.roles[0].name; // Extract role name

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("userId", response.user.id);
      window.dispatchEvent(new Event("storage"));

      // Redirect based on user role
      switch (userRole) {
        case "Admin":
          navigate("/routes");
          break;
        case "CNO":
          navigate("/cno-routes");
          break;
        default:
          navigate("/dashboard");
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
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Username/Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
              />
            </MDBox>
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
              {error && (
                <FormHelperText error sx={{ mt: 1, fontSize: "0.875rem" }}>
                  {error}
                </FormHelperText>
              )}
            </MDBox>
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
