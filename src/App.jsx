import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
      {/* <h2 className="text-black text-4xl font-semibold">Hello World</h2> */}
    </>
  );
}

export default App;
