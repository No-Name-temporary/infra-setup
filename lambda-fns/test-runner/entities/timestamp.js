function getTimestamp() {
  const epoch = Date.now();
  const dateString = (new Date(epoch)).toUTCString();
  return dateString;
}

module.exports = getTimestamp;

