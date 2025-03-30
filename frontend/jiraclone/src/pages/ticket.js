import React, { useEffect, useState} from 'react';
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/fullticket.module.css";
import { Topbar } from '../components/topbar';

export function FullTicket() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tid = searchParams.get("tid");
    const pid = searchParams.get("pid");
    const [ticket, setTicket] = useState({
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        story_points: 20,
        priority: 2
    });
    const [isAdmin, setAdmin] = useState(true);
    const [isAssigned, setAssigned] = useState(true);
    const [httpCode, setHttpCode] = useState();

    useEffect (() => {
        fetch(`http://127.0.0.1:10001/ticket/${tid}`, {method: "GET"})
            .then(response => {
                if (response.status === 401){
                    throw new Error("Unauthorized request");
                } else if (response.status !== 200){
                    throw new Error(`API error: ${response.status}`);
                } else {
                    return response.json;
                }
            })
            .then(data => {
                setTicket(data);
            }).catch(e => {
                if (e.message === "Unauthorized request"){
                    navigate("/login");
                } else {
                    //setTicket({title:"Server Error", description:"Server Error"});
                    alert(`${e.message}. Please reload the page`);
                }
            })
    }, []);

    function markCompleted(ticket){
        return function (){
            fetch("http://127.0.0.1:10001/ticket/update/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tid:ticket.tid,
                    title:ticket.title,
                    description:ticket.description,
                    assigned_to:ticket.assigned_to,
                    story_points:ticket.story_points,
                    creator:ticket.creator,
                    priority:ticket.priority,
                    date_created:ticket.date_created,
                    completed:true,
                    date_completed:ticket.date_completed,
                    date_assigned:ticket.date_assigned,
                    assigned:ticket.assigned
                })
            })
            .then(response => {
                setHttpCode(response.status);
            });
    
            if (httpCode !== 200){
                alert(`Server Error: ${httpCode}. Please try again`);
                return;
            }
    
            navigate(`/dashboard`);
        };
    }


    return (
        <div className={styles.outerContainer}>
            <Topbar page_name="Ticket" className={styles.topbar}/>
            <div className={styles.container}>
            
                {/* Title */}
                <h1 className={styles.title}>{ticket.title}</h1>

                {/* Priority and Story Points */}
                <div className={styles.metadataContainer}>
                    <span className={styles.metadataLabel}>Priority:</span>
                    <span className={styles.metadataValue}>{ticket.priority}</span>
                    <span style={{ flex: 1 }}></span> {/* Spacer */}
                    <span className={styles.metadataLabel}>Story Point Estimate:</span>
                    <span className={styles.metadataValue}>{ticket.story_points}</span>
                </div>

                {/*Assigned to*/}
                    <div className={styles.metadataContainer}>
                    <span className={styles.metadataLabel}>Assigned to:</span>
                    <span className={styles.metadataValue}>{ticket.assigned_to}</span>
                </div>

                {/* Divider */}
                <hr className={styles.divider} />

                {/* Description */}
                <div className={styles.descriptionContainer}>
                    <span className={styles.metadataLabel}>Description:</span>
                    <p className={styles.descriptionText}>{ticket.description}</p>
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.contactButton} onClick={() => navigate(`/contactadmin?tid=${tid}&pid=${pid}`)} type="button">Contact Admin</button>
                    {isAdmin ? <button className={styles.editButton} onClick={() => navigate(`/ticketedit?tid=${tid}&pid=${pid}`)} type="button">Edit Ticket</button> : null}
                    {isAssigned ? <button className={styles.completeButton} onClick={markCompleted(ticket)} type="button">Mark as Complete</button> : null}
                </div>
            </div>
        </div>
    );
}

export default FullTicket