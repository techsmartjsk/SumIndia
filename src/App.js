import logo from "./logo.svg";
import "./App.css";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { PrivateRoutes } from "./routes/private.routes";
import { Register } from "./pages/register";
import { CreatePrescription } from "./pages/create.prescription";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/prescription/create"
            element={<CreatePrescription />}
          ></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
