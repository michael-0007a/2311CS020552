import { useEffect } from "react";
import { Log } from "./api/logger";
import { NotificationsPage } from "./pages/NotificationsPage";
import { Box, CssBaseline } from "@mui/material";
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <CssBaseline />
      <NotificationsPage />
    </Box>
  );
}

export default App;