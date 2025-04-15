import { createContext, useContext, useState } from "react";

interface AppContextType {
  appState: IFetchUser | null;
  setAppState: (v: any) => void;
}
const AppContext = createContext<AppContextType | null>(null);

export const useCurrentApp = () => {
  const currentTheme = useContext(AppContext);

  if (!currentTheme) {
    throw new Error("currentTheme has to be used within <AppContext.Provider>");
  }

  return currentTheme;
};

interface IProps {
  children: React.ReactNode;
}
const AppProvider = (props: IProps) => {
  const [appState, setAppState] = useState<IFetchUser | null>(null);
  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {props.children}
    </AppContext.Provider>
  );
};
export default AppProvider;
