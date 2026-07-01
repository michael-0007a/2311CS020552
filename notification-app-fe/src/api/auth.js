import { AUTH_URL, REGISTER_URL, savedCredentials, studentDetails } from "./config";
import { Log } from "./logger";

function hasStudentDetails() {
  return (
    studentDetails.email &&
    studentDetails.name &&
    studentDetails.mobileNo &&
    studentDetails.githubUsername &&
    studentDetails.rollNo &&
    studentDetails.accessCode
  );
}

export async function registerStudent() {
  if (!hasStudentDetails()) {
    await Log("frontend", "error", "auth", "Registration validation failed");
    throw new Error("Missing registration details in .env.local");
  }

  try {
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentDetails),
    });

    if (!response.ok) {
      await Log("frontend", "error", "auth", "Registration request failed");
      throw new Error("Registration failed");
    }

    const data = await response.json();
    const clientID = data.clientID || data.clientId;
    const clientSecret = data.clientSecret;

    if (!clientID || !clientSecret) {
      await Log("frontend", "error", "auth", "Registration response missing credentials");
      throw new Error("Registration response did not include credentials");
    }

    localStorage.setItem("clientID", clientID);
    localStorage.setItem("clientSecret", clientSecret);
    await Log("frontend", "info", "auth", "Registration completed");

    return { clientID, clientSecret };
  } catch (error) {
    await Log("frontend", "fatal", "auth", "Unexpected registration error");
    throw new Error(error.message || "Registration error", { cause: error });
  }
}

export async function authenticateStudent() {
  try {
    let clientID = localStorage.getItem("clientID") || savedCredentials.clientID;
    let clientSecret = localStorage.getItem("clientSecret") || savedCredentials.clientSecret;

    if (!clientID || !clientSecret) {
      const credentials = await registerStudent();
      clientID = credentials.clientID;
      clientSecret = credentials.clientSecret;
    }

    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: studentDetails.email,
        name: studentDetails.name,
        rollNo: studentDetails.rollNo,
        accessCode: studentDetails.accessCode,
        clientID,
        clientSecret,
      }),
    });

    if (!response.ok) {
      await Log("frontend", "error", "auth", "Authentication request failed");
      throw new Error("Authentication failed");
    }

    const data = await response.json();
    const token = data.access_token || data.accessToken || data.token;

    if (!token) {
      await Log("frontend", "error", "auth", "Authentication response missing token");
      throw new Error("Authentication response did not include a token");
    }

    localStorage.setItem("clientID", clientID);
    localStorage.setItem("clientSecret", clientSecret);
    localStorage.setItem("accessToken", token);
    await Log("frontend", "info", "auth", "Authentication completed");

    return token;
  } catch (error) {
    await Log("frontend", "fatal", "auth", "Unexpected authentication error");
    throw new Error(error.message || "Authentication error", { cause: error });
  }
}

export async function getAccessToken() {
  const savedToken = localStorage.getItem("accessToken") || savedCredentials.accessToken;

  if (savedToken) {
    localStorage.setItem("accessToken", savedToken);
    return savedToken;
  }

  return authenticateStudent();
}
