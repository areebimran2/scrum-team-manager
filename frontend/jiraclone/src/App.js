import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import NotFound from "./pages/404";
import RecoveryRequest from "./pages/recoveryrequest";
import RecoveryRequestSuccess from "./pages/recoveryrequestsuccess";

export function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recoveryrequest" element={<RecoveryRequest />} />
            <Route path="/recoveryrequestsuccess" element={<RecoveryRequestSuccess />} />
            <Route path="/" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
    );
}

export default App;