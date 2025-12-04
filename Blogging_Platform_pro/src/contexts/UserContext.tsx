import { createContext, useState, useEffect } from "react";
import type { UserContextInterface } from "../Helper/Type";

export const UserContext = createContext<UserContextInterface>({
  currentLoggedInUserData: null,
  setCurrentLoggedInUserData: () => {},
  loading: false,
  setLoading: () => {},
});

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentLoggedInUserData, setCurrentLoggedInUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{},[currentLoggedInUserData,loading])

  return (
    <UserContext.Provider
      value={{
        currentLoggedInUserData,
        setCurrentLoggedInUserData,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
