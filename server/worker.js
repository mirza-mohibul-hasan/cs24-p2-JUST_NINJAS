const { parentPort } = require("worker_threads");

let result = 0;

parentPort.postMessage(result);
