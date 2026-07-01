import { useEffect } from "react";
import { Log } from "./api/logger";
import { NotificationsPage } from "./pages/NotificationsPage";

function App() {
  useEffect(() => {
    localStorage.setItem(
      "accessToken",
      import.meta.env.VITE_ACCESS_TOKEN
    );

    // Log application startup
    Log("frontend", "info", "config", "Application start");
  }, []);

  return <NotificationsPage />;
}

export default App;