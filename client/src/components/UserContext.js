import React, { createContext, useContext, useState } from 'react';
import { parseJwt } from "../utils.js";

export const userContext = createContext(null);

const setupContext = () => {
  let userFromStorage = window.localStorage.getItem('greatnotes-user');
  let user = userFromStorage ? JSON.parse(userFromStorage) : null;
  const [currentUser, setCurrentUserState] = useState(user);
  
  const setCurrentUser = async (user) => {
    let userInfo = parseJwt(user['id_token']);
    let userLocal = user;
    userLocal["name"] = userInfo["name"];
    userLocal["picture"] = userInfo["picture"];
    window.localStorage.setItem('greatnotes-user', JSON.stringify(userLocal));
    setCurrentUserState(userLocal);
  }

  const removeCurrentUser = () => {
    window.localStorage.removeItem('greatnotes-user');
    setCurrentUserState(null);
  }

  return {
    user: currentUser,
    setCurrentUser,
    removeCurrentUser
  }
}

export const UserProvider = ({ children }) => {
  const context = setupContext();

  return <userContext.Provider value={context}>{children}</userContext.Provider>;
}

export const useAuth = () => {
  return useContext(userContext);
}

export default useAuth;
