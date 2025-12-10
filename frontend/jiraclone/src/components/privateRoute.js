import getAuthCookie from "./getAuthCookie"
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}) => {
    const token = getAuthCookie();

    if (token === null){
        return <Navigate to="/login" />;
    } else {
        return children;
    }
}

export default PrivateRoute;