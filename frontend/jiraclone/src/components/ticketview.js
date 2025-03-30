import { React, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/ticketview.module.css';

export function TicketView({ input, mode, inputMembers, pid }) {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => { setTickets(input) }, [input]);
    useEffect(() => { setMembers(inputMembers); console.log(inputMembers) }, [inputMembers]);

    const TicketCard = ({ ticket }) => {
        if (mode === 'dashboard') {
            // let assignee = members.find(member => member.uid === ticket.assigned);
            // let displayName = (typeof(assignee) !== "undefined" ? assignee.display_name : "");
            return (
                <div className={styles.DticketCard}>
                    <a className={styles.ticketTitle} onClick={() => navigate(`/ticket?tid=${ticket.tid}`)}>{ticket.title}</a>
                    <p className={styles.descriptors}>{ticket.project}</p>
                    <input type="checkbox" checked={ticket.completed} readOnly className={styles.checkbox} />
                    <p className={styles.descriptors}>{ticket.priority}</p>
                    <p className={styles.descriptors}>{ticket.story_points}</p>
                </div>
            );
        } else if (mode === 'project') {
            let assignee = members.find(member => member.uid === ticket.assigned);
            let displayName = (typeof(assignee) !== "undefined" ? assignee.display_name : "");
            return (
                <div className={styles.PticketCard}>
                    <p className={styles.ticketTitle} onClick={() => navigate(`/ticket?tid=${ticket.tid}`)}>{ticket.title}</p>
                    <p className={styles.descriptors}>{displayName}</p>
                    <input type="checkbox" checked={ticket.completed} readOnly className={styles.checkbox} />
                    <p className={styles.descriptors}>{ticket.priority}</p>
                    <p className={styles.descriptors}>{ticket.story_points}</p>
                </div>
            );
        }
    };

    return (
        <div className={styles.ticketList}>
            {tickets.map(ticket => (<TicketCard key={ticket.tid} ticket={ticket} />))}
        </div>
    );
}