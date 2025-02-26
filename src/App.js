import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import cnoroutes from "cno-routes";
import { useMaterialUIController } from "context";
import brandWhite from "assets/images/ncklogo.png";
import brandDark from "assets/images/ncklogo.png";
import SignIn from "layouts/authentication/sign-in";
import PropTypes from "prop-types";

// Check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem("authToken");

// Private Route Component to Enforce Authentication
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/authentication/sign-in" replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  const [controller] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  useMemo(() => {
    setRtlCache(
      createCache({
        key: "rtl",
        stylisPlugins: [rtlPlugin],
      })
    );
  }, []);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        <Routes>
          {/* Redirect root ("/") to authentication page */}
          <Route path="/" element={<Navigate to="/authentication/sign-in" replace />} />
          <Route path="/authentication/sign-in" element={<SignIn />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                {layout === "dashboard" && (
                  <>
                    <Sidenav
                      color={sidenavColor}
                      brand={
                        (transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite
                      }
                      brandName="Nursing Council of Kenya"
                      routes={routes}
                    />
                    <Configurator />
                  </>
                )}
                <Routes>
                  {routes.map(
                    (route) =>
                      route.route && (
                        <Route key={route.key} path={route.route} element={route.component} />
                      )
                  )}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <Routes>
        {/* Redirect root ("/") to authentication page */}
        <Route path="/" element={<Navigate to="/authentication/sign-in" replace />} />
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              {layout === "dashboard" && (
                <>
                  <Sidenav
                    color={sidenavColor}
                    brand={
                      (transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite
                    }
                    brandName="Nursing Council of Kenya"
                    routes={routes}
                  />
                  <Configurator />
                </>
              )}
              <Routes>
                {routes.map(
                  (route) =>
                    route.route && (
                      <Route key={route.key} path={route.route} element={route.component} />
                    )
                )}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
