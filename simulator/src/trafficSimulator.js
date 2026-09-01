require("dotenv").config();

const axios = require("axios");

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3000";
const REQUEST_INTERVAL_MS =
  Number(process.env.REQUEST_INTERVAL_MS) || 1000;

const endpoints = [
  {
    method: "GET",
    path: "/api/users"
  },
  {
    method: "GET",
    path: "/api/products"
  },
  {
    method: "GET",
    path: "/api/health"
  },
  {
    method: "POST",
    path: "/api/login"
  }
];

const users = [
  "u101",
  "u102",
  "u103",
  "u104",
  "u105"
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function sendRequest() {
  const endpoint = randomItem(endpoints);
  const userId = randomItem(users);

  try {
    const config = {
      method: endpoint.method,
      url: `${TARGET_URL}${endpoint.path}`,
      headers: {
        "x-user-id": userId
      }
    };

    if (endpoint.method === "POST") {
      config.data = {
        username: `user_${userId}`,
        password: "simulation-password"
      };
    }

    const response = await axios(config);

    console.log(
      `[TRAFFIC] ${endpoint.method} ${endpoint.path} → ${response.status}`
    );
  } catch (error) {
    if (error.response) {
      console.log(
        `[TRAFFIC] ${endpoint.method} ${endpoint.path} → ${error.response.status}`
      );
    } else {
      console.log(
        `[ERROR] ${endpoint.method} ${endpoint.path} → ${error.message}`
      );
    }
  }
}

console.log("VLAPIS traffic simulator started");
console.log(`Target: ${TARGET_URL}`);
console.log(`Interval: ${REQUEST_INTERVAL_MS}ms`);

setInterval(sendRequest, REQUEST_INTERVAL_MS);