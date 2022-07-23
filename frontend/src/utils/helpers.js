/* eslint-disable arrow-body-style */
export const snakeToCamel = (str) => {
  return str.toLowerCase().replace(/([-_][a-z])/g, (group) => {
    return group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

export const namesToCamelCase = (data) => {
  return data.map((item) => {
    return { ...item, name: snakeToCamel(item.name) };
  });
};

export const formatDateLong = (dueDateStr) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(Date.parse(dueDateStr, 'YYYY-MM-DD')).toLocaleDateString('en-us', options);
};

export const allKeysToCamelCase = (data) => {
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i += 1) {
    if (typeof data[keys[i]] === 'object' && data[[keys[i]]] !== null) {
      allKeysToCamelCase(data[keys[i]]);
    } else {
      const tmp = data[keys[i]];
      const newKey = snakeToCamel(keys[i]);
      delete data[keys[i]];
      data[newKey] = tmp;
    }
  }
};
