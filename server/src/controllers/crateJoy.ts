import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

const clientId = process.env.CRATEJOY_KEY;
const clientSecret = process.env.CRATEJOY_SECRET;

const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);

router.use(async (req, res) => {
  const { path: endpoint, method, body: requestBody } = req.body;

  const baseUrl = "https://api.cratejoy.com/v1";
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body:
        ["POST", "PUT", "PATCH"].includes(method) && requestBody
          ? JSON.stringify(requestBody)
          : undefined,
    });

    const contentType = response.headers.get("content-type");
    let data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    console.error("Error proxying request to Cratejoy:", error);
    res.status(500).send({ error: "Error communicating with Cratejoy API" });
  }
});

export default router;
