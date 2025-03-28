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
import { BarGraphExample } from "./pages/bargraphexample";
import FullTicket from "./pages/ticket";
import TicketEdit from "./pages/ticketedit";
import MessageSend from "./pages/messageSend";
import ContactAdmin from "./pages/contactadmin";
import Project from "./pages/project"

export function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/profile" element={ <ProfileEdit />  } />
            <Route path="/recoveryrequest" element={  <RecoveryRequest />  } />
            <Route path="/recoveryrequestsuccess" element={  <RecoveryRequestSuccess />  } />
            <Route path="/*" element={<NotFound />} />
            <Route path="/ticket" element={<FullTicket />} />
            <Route path="/barexample" element={<BarGraphExample />}></Route>
            <Route path="/projectedit" element={<ProjectEdit />} />
            <Route path="/adminproject" element={<AdminProject />} />
            <Route path="/ticketedit" element={<TicketEdit />} />
            <Route path="/message" element={< MessageSend />} />
            <Route path="/contactadmin" element={<ContactAdmin />} />
            <Route path="/project" element={<Project />} />

        </Routes>
    </BrowserRouter >
    );
}

export default App;