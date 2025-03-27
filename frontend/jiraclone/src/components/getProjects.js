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
            .then(response => {
                if (response.status == 401){
                    throw new Error("Unauthorized request");
                } else if (response.status != 200){
                    throw new Error(`API error: ${response.status}`);
                } else {
                    return response.json;
                }
            })
            .then(data => {
                setProjects(
                    [
                        ...projects,
                        data
                    ]
                    );
            });
            
        }

        return () => {
            controller.abort();
        }

    }
    , []);

    return projects;

}