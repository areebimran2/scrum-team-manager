import { useState, useEffect } from "react";
/**
 * Takes a list of Projecct IDs, returns a list of Project objects as defined by the API docs.
 * @param {[int]} userPIDs 
 * @returns {[object]} Projects
 */
export function GetProjects(userPIDs) {
  const [projects, setProjects] = useState([]);
  
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;   
        
        for (var pid in userPIDs) {

            fetch("http://127.0.0.1:10001/project/" + pid, {method: "GET"})
            .then(response => response.json())
            .then(data => {
                setProjects(
                    [
                        ...projects,
                        data
                    ]
                    );
            })
            .catch(error => {
                console.error("Error: ", error);
            });
            
        }

        return () => {
            controller.abort();
        }

    }
    , []);

    return projects;

}