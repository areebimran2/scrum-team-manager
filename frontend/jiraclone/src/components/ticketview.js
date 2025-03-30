import { React, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/ticketview.module.css';

export function TicketView({ input, mode }) {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);

    useEffect(() => setTickets(input), []);
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
          return (
            <div className={styles.PticketCard}>
                <p className={styles.ticketTitle} onClick={() => navigate(`/ticket?tid=${ticket.tid}`)}>{ticket.title}</p>
                <p className={styles.descriptors}>{ticket.assigned}</p>
                <input type="checkbox" checked={ticket.completed} readOnly className={styles.checkbox}/>            
                <p className={styles.descriptors}>{ticket.priority}</p> 
                <p className={styles.descriptors}>{ticket.story_points}</p>         
            </div>
          );
        }
      };

  return (
    <div className={styles.ticketList}>
      {tickets.map(ticket => (
        <TicketCard key={ticket.tid} ticket={ticket} />
      ))}
    </div>
  );
}