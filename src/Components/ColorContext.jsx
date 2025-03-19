import React, { createContext, useState } from "react";

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState("#0D2818"); // Default background color

  return (
    <ColorContext.Provider value={{ backgroundColor, setBackgroundColor }}>
      {children}
    </ColorContext.Provider>
  );
};
