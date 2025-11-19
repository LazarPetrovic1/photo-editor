import { createContext, useState } from "react";

function useAlerts() {
  const [alerts, setAlerts] = useState(() => []);
  const addAlert = (msg, type) => setAlerts((prev) => [...prev, { id: crypto.randomUUID(), type, msg }]);
  const removeAlert = (id) => setAlerts(prev => prev.filter(x => x.id !== id));
  const clearAlerts = () => setAlerts(() => []);
  return { alerts, addAlert, removeAlert, clearAlerts }
}

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const { alerts, addAlert, removeAlert, clearAlerts } = useAlerts();
  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAlerts }}>{children}</AlertContext.Provider>
  )
}