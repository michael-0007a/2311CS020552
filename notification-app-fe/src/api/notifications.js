import { getAccessToken } from "./auth";
import { NOTIFICATIONS_URL } from "./config";
import { Log } from "./logger";

export async function fetchNotifications() {
  try {
    const token = await getAccessToken();

    const response = await fetch(NOTIFICATIONS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await Log("frontend", "error", "api", "Failed notifications API request");
      throw new Error("Failed to load notifications");
    }

    await Log("frontend", "info", "api", "Successful notifications API request");
    return response.json();
  } catch (error) {
    await Log("frontend", "fatal", "api", "Unexpected notifications API error");
    throw new Error(error.message || "Unexpected API error", { cause: error });
  }
}

