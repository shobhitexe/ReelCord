import http from "http";

export const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");

  if (req.url === "/health") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    res.end(JSON.stringify({ status: "Everything is fine here" }));
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end(JSON.stringify({ status: "Invalid route" }));
  }
});
