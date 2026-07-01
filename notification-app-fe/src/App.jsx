import { useEffect } from "react";
import { Log } from "./api/logger";
import { NotificationsPage } from "./pages/NotificationsPage";
import { Box, CssBaseline, ThemeProvider, createTheme, alpha } from "@mui/material";

const glassTheme = createTheme({
  palette: {
    background: {
      default: "#f5f7fa",
      paper: alpha("#ffffff", 0.4),
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          border: `1px solid ${alpha("#ffffff", 0.5)}`,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
          borderRadius: "16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          backgroundColor: alpha("#ffffff", 0.4),
          border: `1px solid ${alpha("#ffffff", 0.5)}`,
          boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.05)",
          borderRadius: "12px",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            backgroundColor: alpha("#ffffff", 0.6),
            boxShadow: "0 8px 24px 0 rgba(31, 38, 135, 0.08)",
          },
        },
      },
    },
  },
});

function App() {
  useEffect(() => {
    localStorage.setItem(
      "accessToken",
      import.meta.env.VITE_ACCESS_TOKEN
    );

    // Log application startup
    Log("frontend", "info", "config", "Application start");
  }, []);

  return (
    <ThemeProvider theme={glassTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          backgroundAttachment: "fixed",
        }}
      >
        <NotificationsPage />
      </Box>
    </ThemeProvider>
  );
}

export default App;