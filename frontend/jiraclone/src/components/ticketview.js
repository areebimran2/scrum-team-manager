import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/ticketview.module.css';

export function TicketView({ tickets }) {

  /**
   * Change the ticket card to display the correct information according to the ERD (story points, completion status, etc.)
   * 
   * What might work best for reusing this for other pages would be specifying the info you want displayed 
   * but i don't know how to do that, that's just a hypothetical. 
   */

  const TicketCard = ({ tickets }) => {
    return (
      <div className={styles.ticketCard}>
        <h3 className={styles.ticketTitle}>{tickets.title}</h3>
        <p className={styles.ticketDescription}>{tickets.description}</p>
      </div>
    );
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