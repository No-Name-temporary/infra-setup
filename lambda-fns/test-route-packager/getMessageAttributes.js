function getMessageAttributes(arr) {
  const msgAttributes = {};

  arr.forEach(region => {
    msgAttributes[region] = {
      DataType: 'String',
      StringValue: 'location'
    };
  });

  return msgAttributes;
}

module.exports = getMessageAttributes;