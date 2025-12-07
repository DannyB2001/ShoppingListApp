import http from "http";
import { mockServer } from "./mock/mockServer.js";

const PORT = process.env.BACKEND_PORT || 4000;

function send(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...headers,
  });
  res.end(JSON.stringify(payload));
}

function parseEndpoint(url) {
  return url.replace(/^\/+api\//, "");
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "POST" || !req.url.startsWith("/api/")) {
    send(res, 404, { status: "error", error: "Nenalezeno" });
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 1_000_000) {
      req.connection.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const dtoIn = body ? JSON.parse(body) : {};
      const endpoint = parseEndpoint(req.url);
      const result = await mockServer.call(endpoint, dtoIn);
      send(res, 200, result);
    } catch (error) {
      send(res, 500, { status: "error", error: error.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Mock backend naslouchá na http://localhost:${PORT}`);
});
