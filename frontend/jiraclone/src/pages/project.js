import { React, useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom/client';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Topbar } from '../components/topbar';
import { TicketView } from '../components/ticketview';
import styles from "../styles/project.module.css";

export function Project() {
    const navigate = useNavigate();
    const [total_tickets, setTotalTickets] = useState([]);
    const [uid, setUID] = useState();
    const [project, setProject] = useState({name:"", description:""});

    const [searchParams, setSearchParams] = useSearchParams();
    let pid = [searchParams.get("pid")];

    useEffect(() => console.log(project), [project]);

    useEffect(() => {

        fetch(`http://127.0.0.1:10001/project/${pid}/tickets/`, { method: "GET", credentials: "include", })
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
                setTotalTickets(data.tickets);
            }).catch(e => {
                if (e.message === "Unauthorized request") {
                    navigate("/login");
                    alert("Unauthorized Request");
                } else {
                    alert(`${e.message}. Please reload the page`);
                }
            });

            fetch(`http://127.0.0.1:10001/project/${pid}`, { method: "GET", credentials: "include", })
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
                setProject(data[0]);
            }).catch(e => {
                if (e.message === "Unauthorized request") {
                    navigate("/login");
                    alert("Unauthorized Request");
                } else {
                    alert(`${e.message}. Please reload the page`);
                }
            });

        fetch(`http://127.0.0.1:10001/userprofile/`, { method: "GET", credentials: "include", })
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
                setUID(data.uid);
            }).catch(e => {
                if (e.message === "Unauthorized request") {
                    navigate("/login");
                    alert("Unauthorized Request");
                } else {
                    alert(`${e.message}. Please reload the page`);
                } 
            });

    }, []);

    return (
        <div>
            <Topbar page_name={project.name} />
            <div className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.description}>{project.description}</p>
                    <h1 className={styles.headers}>My Tickets</h1>
                    <div className={styles.ticketInfo}>
                        <p className={styles.ticketTitle}>Ticket</p>
                        <p className={styles.categories}>Assignee</p>
                        <p className={styles.categories}>Completed</p>
                        <p className={styles.categories}>Priority</p>
                        <p className={styles.categories}>SP</p>
                    </div>
                    <div className={styles.innerContainer}>
                        <TicketView input={total_tickets.filter(ticket => ticket.assigned === uid)} mode="project" />
                    </div>
                    <h1 className={styles.headers}>Other Tickets</h1>
                    <div className={styles.ticketInfo}>
                        <p className={styles.ticketTitle}>Ticket</p>
                        <p className={styles.categories}>Assignee</p>
                        <p className={styles.categories}>Completed</p>
                        <p className={styles.categories}>Priority</p>
                        <p className={styles.categories}>SP</p>
                    </div>
                    <div className={styles.innerContainer}>
                        <TicketView input={total_tickets.filter(ticket => ticket.assigned !== uid)} mode="project" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project;