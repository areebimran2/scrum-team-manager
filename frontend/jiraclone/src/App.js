import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import NotFound from "./pages/404";
import RecoveryRequest from "./pages/recoveryrequest";
import RecoveryRequestSuccess from "./pages/recoveryrequestsuccess";
import Signup from "./pages/signup";
import ProfileEdit from "./pages/profileedit"
import Dashboard from "./pages/dashboard";
import ProjectList from "./pages/projectlist";
import { BarGraphExample } from "./pages/bargraphexample";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css'
import FullTicket from "./pages/ticket";

export function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfileEdit />} />
                <Route path="/recoveryrequest" element={<RecoveryRequest />} />
                <Route path="/recoveryrequestsuccess" element={<RecoveryRequestSuccess />} />
                <Route path="/ticket" element={<FullTicket />} />
            <Route path="/" element={<NotFound />} />
                <Route path="/projectlist" element={<ProjectList />}></Route>
                <Route path="/barexample" element={<BarGraphExample />}></Route>
            </Routes>
        </BrowserRouter >
    );
}

export default App;