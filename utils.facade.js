import Worker from "./app.worker.js";

const worker = new Worker();
let nextTrackId = 1;
let callbacks = new Map();

// TODO: replace RxJs
worker.addEventListener("message", function ({ data: { trackId, result } }) {
  if (callbacks.has(trackId)) {
    callbacks.get(trackId)(result);
    callbacks.delete(trackId);
  }
});

worker.addEventListener("error", function (e) {
  console.log(e);
});

const withMsg = (envelop, { resolve, reject }) => (result) => {
  if (result.isError) {
    console.log("Something went wrong");
    reject(result);
    return;
  }
  console.log("The result of dashed", envelop.msg.args, " is ", result.value);
  resolve({ value: result.value, envelop });
};

export const send = (msg) => {
  const envelop = createEnvelop(msg);
  return new Promise((resolve, reject) => {
    callbacks.set(envelop.trackId, withMsg(envelop, { resolve, reject }));
    worker.postMessage(envelop);
  });
};

const createEnvelop = (msg) => ({
  trackId: nextTrackId++,
  msg,
});
