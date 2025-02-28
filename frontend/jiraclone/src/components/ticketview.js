import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/ticketview.module.css';

export function TicketView({ tickets, mode }) {
    const navigate = useNavigate();
    /**
     * TODO:
     * change the link for ticket title (line 18) to work.
     * maybe add checkbox functionality in the future but I'm just leaving it for now 
     */

    const TicketCard = ({ tickets }) => {
      if (mode === 'dashboard') {
       return (
        <div className={styles.DticketCard}>
            <a className={styles.ticketTitle} onClick={() => navigate("/ticket")}>{tickets.title}</a>
            <p className={styles.descriptors}>{tickets.project}</p>  
            <input type="checkbox" checked={tickets.completed} readOnly className={styles.checkbox}/>          
            <p className={styles.descriptors}>{tickets.priority}</p> 
            <p className={styles.descriptors}>{tickets.story_points}</p>      
        </div>
        ); 
      } else if (mode === 'project') {
          return (
            <div className={styles.PticketCard}>
                <p className={styles.ticketTitle} onClick={() => navigate("/ticket")}>{tickets.title}</p>
                <p className={styles.descriptors}>{tickets.assigned}</p>
                <input type="checkbox" checked={tickets.completed} readOnly className={styles.checkbox}/>            
                <p className={styles.descriptors}>{tickets.priority}</p> 
                <p className={styles.descriptors}>{tickets.story_points}</p>         
            </div>
          );
        }
      };
    
      const TicketList = ({ tickets }) => {
        return (
          <div className={styles.ticketList}>
            {tickets.map(ticket => (
              <TicketCard key={ticket.tid} tickets={ticket} />
            ))}
          </div>
        );
      };

  return <TicketList tickets={tickets} />;
}