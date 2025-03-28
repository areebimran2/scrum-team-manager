import { useState } from "react";
/**
 * Takes a list of Ticket IDs, returns a list of Ticket objects as defined by the API docs.
 * @param {[int]} userTIDs 
 * @returns {[object]} Tickets
 */
export function getTickets(userTIDs) {
  const [tickets, setTickets] = useState([]);
  
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;   
        
        for (var tid in userTIDs) {

            fetch("http://127.0.0.1:10001/ticket/" + tid, {method: "GET"})
            .then(response => response.json())
            .then(data => {
                setTickets(
                    [
                        ...tickets,
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

    return tickets;

}