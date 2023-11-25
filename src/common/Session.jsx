const StoreSession = (key, value) => {
  return sessionStorage.setItem(key, value);
};

const LookInSession = (key) => {
  return sessionStorage.getItem(key);
};

const RemoveSession = (key) => {
  return sessionStorage.removeItem(key);
};

export { StoreSession, LookInSession, RemoveSession };
