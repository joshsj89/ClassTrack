// DarkModeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface DarkModeContextType {
    darkMode: boolean;
    toggleDarkMode: (checked: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

interface DarkModeProviderProps {
    children: ReactNode;
}

const isChromeExtension = typeof chrome !== "undefined" && !!chrome.storage;

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        if (isChromeExtension) {
            chrome.storage.sync.get(["darkMode"], (result) => {
                if (typeof result.darkMode === "boolean") {
                    setDarkMode(result.darkMode);
                }
            });
        } else {
            const stored = localStorage.getItem("darkMode");
            if (stored !== null) {
                setDarkMode(stored === "true");
            }
        }
    }, []);

    const toggleDarkMode = (checked: boolean) => {
        setDarkMode(checked);

        if (isChromeExtension) {
            chrome.storage.sync.set({ darkMode: checked });
        } else {
            localStorage.setItem("darkMode", checked.toString());
        }
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
};
