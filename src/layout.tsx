import { Outlet } from "react-router-dom";
import AppHeader from "components/layout/app.header";
import { useEffect } from "react";
import { fetchAccountAPI } from "services/api";
import { useCurrentApp } from "components/context/app.context";
import PuffLoader from "react-spinners/PuffLoader";

const Layout = () => {
  const { setIsAuthenticated, setUser, isLoading, setIsLoading } = useCurrentApp();
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }
    fetchAccount();
  }, []);

  return (
    <>
      {!isLoading ?
        <div>
          <AppHeader />
          <Outlet />
        </div>
        :
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        >
          <PuffLoader
            size={200}
            color={"#36d6b4"}
          />
        </div>}

    </>
  )
}

export default Layout
