import { useEffect } from "react";
import { Log } from "./api/logger";

function App() {
  useEffect(() => {
    localStorage.setItem(
      "accessToken",
      import.meta.env.VITE_ACCESS_TOKEN
    );

    async function test() {
      const ok = await Log(
        "frontend",
        "info",
        "api",
        "Testing logger"
      );

      console.log(ok);
    }

    test();
  }, []);

  return <div>Hello</div>;
}

export default App;