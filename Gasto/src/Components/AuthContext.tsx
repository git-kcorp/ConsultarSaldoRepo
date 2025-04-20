import { createContext, useContext, useState, useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

type AuthContextType = {
  token: string | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id:
        "879160549033-rlq8qd7topa3ostdagjkd4ae6f65jsmc.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/gmail.readonly",
      callback: (tokenResponse: any) => {
        setToken(tokenResponse.access_token);
        localStorage.setItem("access_token", tokenResponse.access_token);
      },
    });

    client.requestAccessToken();
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
