import React, { createContext, useContext, useState } from "react";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: IUser | null;
    setUser: (value: IUser) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

interface IProps {
    children: React.ReactNode;
}

const AppProvider = (props: IProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);
    const { children } = props;
    return (
        <CurrentAppContext.Provider value={{
            isAuthenticated, setIsAuthenticated, user, setUser
        }}>
            {children}
        </CurrentAppContext.Provider>
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