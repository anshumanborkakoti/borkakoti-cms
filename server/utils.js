module.exports.isProd = () => process.env.mode === 'production';

module.exports.makeid = length => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports.logError = (message, reason = '') => {
  const code = `${new Date()}|${this.makeid(20)}`;
  console.error(`[${code}] ${message} Reason: ${reason}`);
  return code;
}

module.exports.logInfo = (message) => {
  const code = `${new Date()}|${this.makeid(20)}`;
  console.log(`[${code}] ${message}`);
  return code;
}

module.exports.getErrorResponse = (message, reason, ...payload) => {
  const code = this.logError(message, reason);
  let payloadOb = {};
  for (let load of payload) {
    payloadOb = {
      ...payloadOb,
      ...load
    }
  }
  return {
    code,
    ...payloadOb
  }
}

module.exports.getInfoResponse = (message, ...payload) => {
  const code = this.logInfo(message);
  let payloadOb = {};
  for (let load of payload) {
    payloadOb = {
      ...payloadOb,
      ...load
    }
  }
  return {
    code,
    ...payloadOb
  }
}


module.exports.memoize = function (func) {
  let cache = {};
  return (...argsArray) => {
    const args = JSON.stringify(argsArray);
    console.log(args)
    if (cache[args] && this.isProd()) {
      this.logInfo("returning from cache")
      return cache[args];
    }
    const result = func.apply(func, argsArray);
    cache[args] = result;
    return result;
  }

}

module.exports.ApiResponse = class {
  constructor (aStatusCode = null, aResponse = null) {
    this.statusCode = aStatusCode;
    this.response = aResponse;
  }
}
