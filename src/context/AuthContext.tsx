import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  refreshAuth: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  refreshAuth: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const readMongoAuth = () => {
  const token = localStorage.getItem("ag_token");
  const role = localStorage.getItem("ag_user_role");
  const uid = localStorage.getItem("ag_user_uid");
  const email = localStorage.getItem("ag_user_email");
  const rawUser = localStorage.getItem("ag_user_data");

  let savedProfile: any = null;

  try {
    savedProfile = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    savedProfile = null;
  }

  if (!token || !role || !savedProfile) {
    return {
      user: null,
      profile: null,
    };
  }

  const profile = {
    id: savedProfile._id || savedProfile.id || uid,
    uid: savedProfile._id || savedProfile.id || uid,
    ...savedProfile,
    role,
    email: savedProfile.email || email,
  };

  const user = {
    uid: profile.uid,
    email: profile.email || email,
  };

  return { user, profile };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = () => {
    setLoading(true);
    const authData = readMongoAuth();
    setUser(authData.user);
    setProfile(authData.profile);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("ag_token");
    localStorage.removeItem("ag_user_role");
    localStorage.removeItem("ag_user_uid");
    localStorage.removeItem("ag_user_email");
    localStorage.removeItem("ag_user_data");
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    refreshAuth();

    const handleAuthUpdate = () => refreshAuth();

    window.addEventListener("storage", handleAuthUpdate);
    window.addEventListener("ag-auth-updated", handleAuthUpdate);

    return () => {
      window.removeEventListener("storage", handleAuthUpdate);
      window.removeEventListener("ag-auth-updated", handleAuthUpdate);
    };
  }, []);

  const adminEmails = ["starspgroups@gmail.com", "durgeshpuri95@gmail.com"];

  const isAdmin =
    profile?.role === "admin" ||
    adminEmails.includes(user?.email?.toLowerCase() || "");

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
