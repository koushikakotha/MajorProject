// MyContext.js
import React, { createContext, useContext } from 'react';

// Create a context
const MyContext = createContext(null);

// Context Provider
export const MyContextProvider = ({ children }) => {
  // Your context value
  const contextValue = {
    basename: '/', // Modify this value according to your context needs
    // Other context properties
  };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

// Custom hook to consume the context value
export const useMyContext = () => {
  const context = useContext(MyContext);

  

  return context;
};
