import { useEffect } from "react";
import useUser from "./hooks/useUser";
import { useNavigate } from "react-router-dom";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { currentLoggedInUserData, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!currentLoggedInUserData) {
      navigate("/");
    }
  }, [currentLoggedInUserData, loading]);

  if (loading) return <div>Loading...</div>;

  if (!currentLoggedInUserData) return null;

  return children;
}
