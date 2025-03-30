import { React, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/ticketview.module.css';

export function TicketView({ input, mode, pid }) {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {setTickets(input)}, [input]);

    useEffect(() => {

        if (pid !== 0){
            fetch(`http://127.0.0.1:10001/project/${pid}/members/`, { method: "GET", credentials: "include", })
                .then(response => {
                    if (response.status === 401) {
                        throw new Error("Unauthorized request");
                    } else if (response.status !== 200) {
                        throw new Error(`API error: ${response.status}`);
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    setMembers(data.members);
                }).catch(e => {
                    if (e.message === "Unauthorized request") {
                        navigate("/login");
                    } else {
                        navigate("/dashboard");
                    }
                });
        }

    }, [])

    /**
     * TODO:
     * change the link for ticket title (line 18) to work.
     * maybe add checkbox functionality in the future but I'm just leaving it for now 
     */

    const TicketCard = ({ ticket }) => {
      if (mode === 'dashboard') {
       return (
        <div className={styles.DticketCard}>
            <a className={styles.ticketTitle} onClick={() => navigate(`/ticket?tid=${ticket.tid}`)}>{ticket.title}</a>
            <p className={styles.descriptors}>{ticket.project}</p>  
            <input type="checkbox" checked={ticket.completed} readOnly className={styles.checkbox}/>          
            <p className={styles.descriptors}>{ticket.priority}</p> 
            <p className={styles.descriptors}>{ticket.story_points}</p>      
        </div>
        ); 
      } else if (mode === 'project') {
            let assignee = members.find(member => member.uid === ticket.assigned);
            console.log(assignee);
          return (
            <div className={styles.PticketCard}>
                <p className={styles.ticketTitle} onClick={() => navigate(`/ticket?tid=${ticket.tid}`)}>{ticket.title}</p>
                <p className={styles.descriptors}>{assignee.display_name}</p>
                <input type="checkbox" checked={ticket.completed} readOnly className={styles.checkbox}/>
                <p className={styles.descriptors}>{ticket.priority}</p> 
                <p className={styles.descriptors}>{ticket.story_points}</p>
            </div>
          );
        }
      };

  return (
    <div className={styles.ticketList}>
      {tickets.map(ticket => ( <TicketCard key={ticket.tid} ticket={ticket} />))}
    </div>
  );
}