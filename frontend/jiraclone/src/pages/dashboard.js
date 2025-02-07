import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/dashboard.module.css';
import defaultProfilePic from '../assets/defaultProfilePic.png';




export function Dashboard() {
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

  // This will need to be changed when tickets are implemented 
  const tickets = [
    {
      tid: 1,
      title: 'Ticket 1',
      description: 'This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card. This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card. This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card.'
    },
    {
      tid: 2,
      title: 'Ticket 2',
      description: 'This is the description for ticket 2'
    },
    {
      tid: 3,
      title: 'Ticket 3',
      description: 'This is the description for ticket 3'
    },
    {
      tid: 4,
      title: 'Ticket 4',
      description: 'This is the description for ticket 4'
    }
  ];

  // This will also have to be changed according to the profile picture of the user.S
  const profilepic = defaultProfilePic

  const ProfilePic = () => {
    return (
      <Link to={'/profile'}>
      <img src={profilepic} alt="Profile Picture" className={styles.image} />
      </Link> 
    );
  };

  return (
    <body className={styles.body}>
      <div>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.ticketContainer}>
        <TicketList tickets={tickets} />
      </div>
      </div>

      <div className={styles.sidebar}>
        <ProfilePic />
      </div>
    </body>
  );
}

export default Dashboard;