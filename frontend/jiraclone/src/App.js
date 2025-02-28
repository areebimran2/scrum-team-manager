import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import NotFound from "./pages/404";
import RecoveryRequest from "./pages/recoveryrequest";
import RecoveryRequestSuccess from "./pages/recoveryrequestsuccess";
import Signup from "./pages/signup";
import ProfileEdit from "./pages/profileedit"
import Dashboard from "./pages/dashboard";
import ProjectEdit from "./pages/projectedit"
import AdminProject from "./pages/adminproject";

export function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileEdit />} />
            <Route path="/recoveryrequest" element={<RecoveryRequest />} />
            <Route path="/recoveryrequestsuccess" element={<RecoveryRequestSuccess />} />
            <Route path="/projectedit" element={<ProjectEdit />} />
            <Route path="/adminproject" element={<AdminProject />} />
            <Route path="/" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
    );
}

export default App;