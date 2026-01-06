import { createContext, useContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [show, setShow] = useState(false);
  const [notificationUpdate, setNotificationUpdate] = useState(false);
  onMessageListener()
    .then((payload) => {
      console.log("🚀 ~ .then ~ payload:", payload);
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      setNotificationUpdate((prev) => !prev);
      setTimeout(() => {
        setShow(false);
        setNotification({ title: "", body: "" });
      }, 3000);
    })
    .catch((err) => console.log("failed: ", err));

  return (
    <AppContext.Provider value={{ notificationUpdate, show, notification }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  return useContext(AppContext);
};

export default useApp;
