import React, { useEffect, useState} from 'react';
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/fullticket.module.css";
import { Topbar } from '../components/topbar';

export function FullTicket() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tid = searchParams.get("tid")
    //const [ticket, setTicket] = useState(null);
    const [error, setError] = useState(null);

    const ticket = {
        Title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        Story_points: 20,
        Priority: 2
    }

    // //GET ticket data from control service
    // useEffect(() => {
    //     // Fetch ticket data
    //     fetch(`http://127.0.0.1:10001/ticket/${tid}`, {
    //         method: 'GET'})
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Error getting ticket');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             setTicket(data);
    //         })
    //         .catch(error => {
    //             setError(error);
    //             //console.error("Fetch error, loading Test Ticket", error);
    //             //setTicket(testTicket);
    //         });
    // }, [tid]);

    if (error) {
        return <div className={styles.errorMessage}>Error: {error.message}</div>;
    }

    if (!ticket) {
        return <div className={styles.errorMessage}>No ticket data found</div>;
    }

    return (
        <div className={styles.outerContainer}>
            <Topbar page_name="Ticket" className={styles.topbar}/>
            <div className={styles.container}>
            
                {/* Title */}
                <h1 className={styles.title}>{ticket.Title}</h1>

                {/* Priority and Story Points */}
                <div className={styles.metadataContainer}>
                    <span className={styles.metadataLabel}>Priority:</span>
                    <span className={styles.metadataValue}>{ticket.Priority}</span>
                    <span style={{ flex: 1 }}></span> {/* Spacer */}
                    <span className={styles.metadataLabel}>Story Point Estimate:</span>
                    <span className={styles.metadataValue}>{ticket.Story_points}</span>
                </div>

                {/* Divider */}
                <hr className={styles.divider} />

                {/* Description */}
                <div className={styles.descriptionContainer}>
                    <span className={styles.metadataLabel}>Description:</span>
                    <p className={styles.descriptionText}>{ticket.Description}</p>
                </div>
            </div>
        </div>
    );
}

export default FullTicket