function deepCopy(obj) {
  return obj === null || typeof obj !== "object"
    ? obj
    : Array.isArray(obj)
    ? obj.map(deepCopy)
    : Object.keys(obj).reduce((copy, key) => {
        copy[key] = deepCopy(obj[key]);
        return copy;
      }, {});
}

function secondsToHMS(seconds) {
  return { hrs: Math.floor(seconds / 3600), mins: Math.floor((seconds % 3600) / 60), secs: seconds % 60 };
}

function hmsToSeconds(hrs, mins, secs) {
  return hrs * 3600 + mins * 60 + secs;
}

export { deepCopy, secondsToHMS, hmsToSeconds };
