import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();

const clientId = process.env.SHIPSTATION_KEY;
const clientSecret = process.env.SHIPSTATION_SECRET;

const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);

router.use(async (req: Request, res: Response) => {
  console.log("🚀 ~ router.BODY ~ req:", req.body);
  const endpoint = req.body.path;
  const method = req.body.method;
  const baseUrl = "https://ssapi.shipstation.com";
  const url = `${baseUrl}${endpoint}`;
  console.log("🚀 ~ router.use ~ url:", url);

  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: ["POST", "PUT", "PATCH"].includes(method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    console.log("🚀 ~ Response status:", response);
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json(); // Parse JSON response
    } else {
      data = await response.text(); // Parse non-JSON response
    }

    res.status(response.status).send(data);
  } catch (error) {
    console.error("Error proxying request to ShipStation:", error);
    res.status(500).send({ error: "Error communicating with ShipStation API" });
  }
});

export default router;
