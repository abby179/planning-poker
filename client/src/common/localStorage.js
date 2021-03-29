export const get = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromObject = (key, property) => {
  const object = get(key);
  return object ? (property in object ? object[property] : null) : null;
};

export const setToObject = (key, property, value) => {
  const object = get(key);
  if (object) {
    object[property] = value;
    set(key, object);
  }
};

export const remove = (key) => {
  localStorage.removeItem(key);
};

export const removeAll = () => {
  localStorage.clear();
};
