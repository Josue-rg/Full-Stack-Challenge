import React, { createContext, useContext, useState } from 'react';

interface UpdateContextType {
  triggerUpdate: () => void;
  updateCounter: number;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export const UpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [updateCounter, setUpdateCounter] = useState(0);

  const triggerUpdate = () => {
    setUpdateCounter(prev => prev + 1);
  };

  return (
    <UpdateContext.Provider value={{ triggerUpdate, updateCounter }}>
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error('useUpdate debe ser usado dentro de un UpdateProvider');
  }
  return context;
};