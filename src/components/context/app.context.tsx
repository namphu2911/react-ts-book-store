import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchAccountAPI } from "services/api";
import { PuffLoader } from "react-spinners";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    user: IUser | null;
    setUser: (value: IUser | null) => void;
    carts: ICart[];
    setCarts: (value: ICart[]) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

interface IProps {
    children: React.ReactNode;
}

const AppProvider = (props: IProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUser | null>(null);
    const [carts, setCarts] = useState<ICart[]>([]);
    const { children } = props;

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            const carts = localStorage.getItem("carts");
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
                if (carts) {
                    setCarts(JSON.parse(carts));
                }
            }
            setIsLoading(false)
        }
        fetchAccount();
    }, [])

    return (
        <>
            {!isLoading ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, user, setIsAuthenticated, setUser,
                    isLoading, setIsLoading,
                    carts, setCarts
                }}>
                    {children}
                </CurrentAppContext.Provider>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px"
                }}>
                    <PuffLoader
                        size={200}
                        color="#36d6b4"
                    />
                    <p style={{
                        color: "#36d6b4",
                        fontSize: "16px",
                        fontWeight: 500,
                        textAlign: "center",
                        margin: 0
                    }}>
                        Connecting to server, please wait...
                    </p>
                </div>
            }
        </>
    );
};

const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);
    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentAppContext.Provider>"
        );
    }
    return currentAppContext;
};

export { AppProvider, useCurrentApp };