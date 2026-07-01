import { LOG_URL } from "./config";

const allowedStacks = ["frontend", "backend"];
const allowedLevels = ["debug", "info", "warn", "error", "fatal"];
const allowedPackages = [
  "api",
  "auth",
  "component",
  "config",
  "hook",
  "middleware",
  "page",
  "state",
  "style",
  "utils",
];

export async function Log(stack, level, packageName, message) {
  if (
    !allowedStacks.includes(stack) ||
    !allowedLevels.includes(level) ||
    !allowedPackages.includes(packageName)
  ) {
    return false;
  }

  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return false;
    }

    const response = await fetch(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Logging failed:", error.message);
    return false;
  }
}
