import React, { createContext, useContext, ReactNode } from "react";

// Define user interface based on the isAuthenticated().user structure
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  // Add other user properties as needed based on your app's user model
}

// Define the context value interface
interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// Create context with proper default values
const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

// Custom hook to use UserContext
export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component props interface
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = React.useState<User | null>(null);

  const setUser = React.useCallback((newUser: User | null) => {
    setUserState(newUser);
  }, []);

  const login = React.useCallback((user: User) => {
    setUserState(user);
  }, []);

  const logout = React.useCallback(() => {
    setUserState(null);
  }, []);

  const isLoggedIn = React.useMemo(() => user !== null, [user]);

  const value = React.useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn,
      login,
      logout,
    }),
    [user, setUser, login, logout, isLoggedIn]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext };
