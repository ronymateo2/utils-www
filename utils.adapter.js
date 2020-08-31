import { Utils, Issue } from "utils";

const utils = Utils.new();

//TODO: generate code instead of switch

const dashed = (name, issue) => {
  return utils.dashed(name, Issue[issue]);
};

export default (worker) => {
  worker.onmessage = (e) => {
    let result = null;
    try {
      switch (e.data.msg.type) {
        case "dashed":
          result = {
            isError: false,
            value: dashed.apply(null, e.data.msg.args),
          };
          break;
        case "get":
          result = {
            isError: false,
            value: utils.get.apply(null, e.data.msg.args),
          };
          break;
      }
    } catch (e) {
      result = {
        isError: true,
        value: e,
      };
    }

    worker.postMessage({
      trackId: e.data.trackId,
      result: result,
    });
  };
};
