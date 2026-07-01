import { getAccessToken } from "./auth";
import { NOTIFICATIONS_URL } from "./config";
import { Log } from "./logger";

export async function fetchNotifications(limit, page, notificationType) {
  try {
    await Log("frontend", "info", "api", "Notification fetch started");

    const token = await getAccessToken();

    const url = new URL(NOTIFICATIONS_URL);
    if (limit !== undefined && limit !== null) {
      url.searchParams.append("limit", limit);
    }
    if (page !== undefined && page !== null) {
      url.searchParams.append("page", page);
    }
    if (notificationType && notificationType !== "All") {
      url.searchParams.append("notification_type", notificationType);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await Log("frontend", "error", "api", "Notification fetch failed");
      throw new Error("Failed to load notifications");
    }

    await Log("frontend", "info", "api", "Notification fetch successful");
    return response.json();
  } catch (error) {
    await Log("frontend", "fatal", "api", `Unexpected notifications API error: ${error.message}`);
    throw new Error(error.message || "Unexpected API error", { cause: error });
  }
}

