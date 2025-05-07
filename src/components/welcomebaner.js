"use client";

import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Remove the Material UI controller if it's causing issues
// import { useMaterialUIController } from "context"

function WelcomeBanner() {
  // Instead of using the controller, we'll use a simpler approach
  // const [controller] = useMaterialUIController()
  // const { darkMode } = controller

  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Get time of day for appropriate greeting
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    // Get user information from localStorage with careful error handling
    try {
      // Check if localStorage is available (for SSR environments)
      if (typeof window !== "undefined" && window.localStorage) {
        const userInfo = localStorage.getItem("userInfo");

        if (userInfo && userInfo !== "undefined") {
          try {
            const userData = JSON.parse(userInfo);
            // Safely access properties with optional chaining
            const name = userData?.name || userData?.username || userData?.firstName || "";
            setUsername(name);
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
          }
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  return (
    <MDBox mb={3}>
      <Grid container>
        <Grid item xs={12}>
          <MDBox p={2} borderRadius="lg" bgColor="white" shadow="lg">
            <MDTypography variant="h4" fontWeight="medium" color="info" textTransform="capitalize">
              {greeting}
              {username ? `, ${username}` : ""}
            </MDTypography>
            <MDTypography variant="body2" color="text" fontWeight="regular">
              Welcome to the Nursing Council of Kenya KeNuM Dashboard
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default WelcomeBanner;
