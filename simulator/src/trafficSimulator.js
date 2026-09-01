require("dotenv").config();

const axios = require("axios");

const TARGET_URL = process.env.TARGET_URL || "https://localhost:3000";

const NORMAL_INTERVAL_MS = Number(process.env.REQUEST_INTERVAL_MS) || 1000;

const SPIKE_INTERVAL_MS = 100;

const endpoints = [
    {
        method : "GET", 
        path : "/api/users"
    }, 
    {
        method : "GET", 
        path : "/api/products"
    }, 
    {
        method : "GET", 
        path : "/api/health"
    }, 
    {
        method : "POST", 
        path : "/api/login"
    }
];

const users = [
    "u101", 
    "u102", 
    "u103", 
    "u104", 
    "u105"
];

let anomalyMode = false;
let anomalyType = null;

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve,ms));
}

function chooseAnomaly(){
    const anomalies = [
        "traffic_spike",
        "error_spike", 
        "slow_requests"
    ];

    return randomItem(anomalies);
}

async function sendRequest(){
    let endpoint;
    const userId = randomItem(users);

    if(anomalyMode && anomalyType ==="error_spike"){
        endpoint = {
            method : "GET", 
            path : "/api/simulation/error"
        }; 
    } else if (anomalyMode && anomalyType === "slow_requests"){
        endpoint = {
            method : "GET", 
            path : "/api/simulation/slow"
        };
    } else {
        endpoint = randomItem(endpoints);
    }

    try {
        const config = {
            method : endpoint.method,
            url : `${TARGET_URL}${endpoint.path}`,
            headers : {
                "x-user-id" : userId
            }
        };

        if(endpoint.method === "POST") {
            config.data = {
                username : `user_${userId}`,
                password : "simulation-password"
            };
        }

        const response = await axios(config);

        console.log(
            `[TRAFFIC] ${endpoint.method} ${endpoint.path} -> ${response.status}`
        );
    } catch (error) {
        if(error.response) {
            console.log(
                `[TRAFFIC] ${endpoint.method} ${endpoint.path} -> ${error.response.status}`
            );
        } else {
            console.log(
                `[ERROR] ${endpoint.method} ${endpoint.path} -> ${error.message}`
            );
        }
    }   
}

async function runTraffic(){
    while(true) {
        await sendRequest();

        const interval = anomalyMode && anomalyType === "traffic_spike"
            ? SPIKE_INTERVAL_MS
            : NORMAL_INTERVAL_MS;

        await sleep(interval);
    }
}

async function runAnomalyScheduler(){
    while(true) {
        const waitTime = 30000 + Math.random() * 30000;

        await sleep(waitTime);

        anomalyMode = true;
        anomalyType = chooseAnomaly();

        console.log("");
        console.log("============================");
        console.log(`ANOMALY INJECTION : ${anomalyType}`);
        console.log("============================");
        console.log("");

        await sleep(10000);

        anomalyMode = false;
        anomalyType = null;

        console.log("");
        console.log("============================");
        console.log("NORMAL TRAFFIC RESUMED");
        console.log("============================");
        console.log("");
    }
}

console.log("VLAPIS traffic simulator started");
console.log(`Target: ${TARGET_URL}`);
console.log(`Normal Interval : ${NORMAL_INTERVAL_MS}`);
console.log(`Spike Interval : ${SPIKE_INTERVAL_MS}`);

runTraffic();
runAnomalyScheduler();