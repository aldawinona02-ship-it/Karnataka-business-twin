import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlatformContextType {
  district: string;
  setDistrict: (district: string) => void;
  role: string;
  setRole: (role: string) => void;
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: (open: boolean) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [district, setDistrict] = useState('All Karnataka');
  const [role, setRole] = useState('Senior Analyst');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  return (
    <PlatformContext.Provider value={{
      district, setDistrict,
      role, setRole,
      isRegistrationModalOpen, setIsRegistrationModalOpen
    }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error('usePlatform must be used within PlatformProvider');
  return context;
};
