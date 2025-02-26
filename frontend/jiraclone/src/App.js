import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import Login from "./pages/login";
import NotFound from "./pages/404";
import RecoveryRequest from "./pages/recoveryrequest";
import RecoveryRequestSuccess from "./pages/recoveryrequestsuccess";
import Signup from "./pages/signup";
import ProfileEdit from "./pages/profileedit"
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./components/privateRoute";

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
        </Routes>
    </BrowserRouter>
    );
}

export default App;