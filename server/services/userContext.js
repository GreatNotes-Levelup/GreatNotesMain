let userContext = {};

export const setUserContext = (user) => {
  userContext = user;
};

export const getUserContext = () => {
  return userContext;
};