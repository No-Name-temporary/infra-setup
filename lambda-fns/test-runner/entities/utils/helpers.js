const containsKeysOrVals = (value, target) => {
  if (Array.isArray(value) && value.length === 0 ||
  isObjectEmpty(value)
  ) {
    return false; 
  }

  if (Array.isArray(value)) {
    return value.some((val) => containsKeysOrVals(val, target));
  } if (typeof value === 'object') {
    if (value === null) {
      return value === target;
    }
    const keys = Object.keys(value);
    const values = Object.values(value);
    return containsKeysOrVals(keys, target) || containsKeysOrVals(values, target);
  }
  return value === target;
};

const hasKeys = (value, target) => {
  if (Array.isArray(value) && value.length === 0 ||
  isObjectEmpty(value) || !Array.isArray(value)
  ) {
    return false; 
  }

  if (Array.isArray(value)) {
    return value.some((val) => hasKeys(val, target));
  } if (typeof value === 'object') {
    if (value === null) {
      return false;
    }
    const keys = Object.keys(value);
    const values = Object.values(value);
    return keys.some((key) => key === target)
    || values.some((val) => hasKeys(val, target));
  }
  return false;
};

const hasValues = (value, target) => {
  if (Array.isArray(value) && value.length === 0 ||
  isObjectEmpty(value) || !Array.isArray(value)
  ) {
    return false; 
  }

  if (Array.isArray(value)) {
    return value.some((val) => hasValues(val, target));
  } if (typeof value === 'object') {
    if (value === null) {
      return false;
    }
    const values = Object.values(value);
    return values.some((val) => val === target)
      || values.some((val) => hasValues(val, target));
  }
  return false;
};

const getValue = (responseBody, property) => {
  const path = property.replace('$', 'responseBody');
  // eslint-disable-next-line no-eval
  return eval(path);
};

const isObjectEmpty = (obj) => Object.keys(obj).length === 0;

const formatProperty = (property) => {
  if (property === null) {
    return '$.'
  } else {
    return property[0] !== '$' ? `$.${property}` : property;
  }
}; 

module.exports = {
  containsKeysOrVals,
  hasKeys,
  hasValues,
  getValue,
  isObjectEmpty,
  formatProperty,
};
