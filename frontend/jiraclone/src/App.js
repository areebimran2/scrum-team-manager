import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import Login from "./pages/login";
import NotFound from "./pages/404";
import RecoveryRequest from "./pages/recoveryrequest";
import RecoveryRequestSuccess from "./pages/recoveryrequestsuccess";
import Signup from "./pages/signup";
import ProfileEdit from "./pages/profileedit"
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./components/privateRoute";
import ProjectEdit from "./pages/projectedit"
import AdminProject from "./pages/adminproject";
import "./styles/Global.css";
import ProjectList from "./pages/projectlist";
import { BarGraphExample } from "./pages/bargraphexample";
import FullTicket from "./pages/ticket";

export function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } />
            <Route path="/profile" element={ <PrivateRoute> <ProfileEdit /> </PrivateRoute> } />
            <Route path="/recoveryrequest" element={ <PrivateRoute> <RecoveryRequest /> </PrivateRoute> } />
            <Route path="/recoveryrequestsuccess" element={ <PrivateRoute> <RecoveryRequestSuccess /> </PrivateRoute> } />
            <Route path="/*" element={<NotFound />} />
            <Route path="/ticket" element={<FullTicket />} />
            <Route path="/projectlist" element={<ProjectList />}></Route>
            <Route path="/barexample" element={<BarGraphExample />}></Route>
            <Route path="/projectedit" element={<ProjectEdit />} />
            <Route path="/adminproject" element={<AdminProject />} />
            <Route path="/project" element={<ProjectList />} />
            <Route path="/ticketedit" element={<FullTicket />} />
        </Routes>
    </BrowserRouter >
    );
}

export default App;