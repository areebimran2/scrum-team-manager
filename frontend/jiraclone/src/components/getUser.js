import { useState } from "react";
/**
 * Takes a user ID, returns a user object as defined by the API docs.
 * @param {int} userID 
 * @returns {object} user
 */
export function getUser(userID) {
  const [user, setUser] = useState(null);
  
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;   
    
        fetch("http://127.0.0.1:10001/userprofile/" + userID, {method: "GET"})
        .then(response => response.json())
        .then(data => {
            setUser(data);
        })
        .catch(error => {
            console.error("Error: ", error);
        });

        return () => {
            controller.abort();
        }

    }
    , []);

    return user;

}