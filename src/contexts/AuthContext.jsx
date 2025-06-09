
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ADMIN_DATA_KEY = 'adminData'; 
const ADMIN_AUTH_STATUS_KEY = 'isAdminAuthenticated';

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const storedAdminData = localStorage.getItem(ADMIN_DATA_KEY);
    const authStatus = localStorage.getItem(ADMIN_AUTH_STATUS_KEY) === 'true';

    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }
    if (authStatus && storedAdminData) { 
      setIsAdminAuthenticated(true);
    }
  }, []);

  const registerAdmin = (email, password) => {
    const newAdminData = { email, password, name: 'Admin User', description: '', profilePhoto: '' };
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(newAdminData));
    setAdminData(newAdminData);
    setIsAdminAuthenticated(true);
    localStorage.setItem(ADMIN_AUTH_STATUS_KEY, 'true');
    toast({ title: "Admin Account Created!", description: "You are now logged in." });
    return true;
  };

  const loginAdmin = (email, password) => {
    const storedAdminData = JSON.parse(localStorage.getItem(ADMIN_DATA_KEY));
    if (storedAdminData && storedAdminData.email === email && storedAdminData.password === password) {
      setAdminData(storedAdminData);
      setIsAdminAuthenticated(true);
      localStorage.setItem(ADMIN_AUTH_STATUS_KEY, 'true');
      toast({ title: "Admin Login Successful!", description: "Welcome back!" });
      return true;
    }
    toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    return false;
  };
  
  const verifyOtp = (otp) => {
    if (otp === "123456") { 
      setIsAdminAuthenticated(true);
      localStorage.setItem(ADMIN_AUTH_STATUS_KEY, 'true');
      toast({ title: "OTP Verified!", description: "Login successful." });
      return true;
    }
    toast({ title: "OTP Verification Failed", description: "Invalid OTP.", variant: "destructive" });
    return false;
  };


  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(ADMIN_AUTH_STATUS_KEY);
    toast({ title: "Logged Out", description: "You have been logged out." });
  };
  
  const updateAdminProfile = (profileData) => {
    const updatedAdminData = { ...adminData, ...profileData };
    setAdminData(updatedAdminData);
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(updatedAdminData));
    toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
  };

  const hasAdminAccount = () => {
    return !!localStorage.getItem(ADMIN_DATA_KEY);
  };

  const value = {
    isAdminAuthenticated,
    adminData,
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    updateAdminProfile,
    hasAdminAccount,
    verifyOtp, 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
