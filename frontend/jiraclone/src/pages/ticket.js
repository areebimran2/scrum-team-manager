import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/fullticket.module.css";
import { Topbar } from '../components/topbar';

export function FullTicket() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tid = searchParams.get("tid");
    const [ticket, setTicket] = useState({
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        story_points: 20,
        priority: 2
    });
    const [isAdmin, setAdmin] = useState(true);
    const [isAssigned, setAssigned] = useState(true);
    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState({});
    const [project, setProject] = useState({});

    useEffect(() => {
        fetch(`http://127.0.0.1:10001/ticket/${tid}`, { method: "GET", credentials: "include", })
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
                setTicket(data);
            }).catch(e => {
                if (e.message === "Unauthorized request") {
                    navigate("/login");
                } else {
                    setTicket({ title: "Server Error", description: "Server Error" });
                    alert(`${e.message}. Please reload the page`);
                }
            })
    }, []);

    useEffect(() => {
        if (typeof (ticket.assigned) !== "undefined" && ticket.assigned !== -1) {
            fetch(`http://127.0.0.1:10001/userprofile/${ticket.assigned}`, { method: "GET", credentials: "include", })
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
                    setUser(data);
                }).catch(e => {
                    if (e.message === "Unauthorized request") {
                        //navigate("/login");
                        alert("Unauthorized Request");
                    } else {
                        alert(`${e.message}. Please reload the page`);
                    }
                });
        }
    }, [ticket]);

    useEffect(() => {
        if (typeof (ticket.project) !== "undefined") {
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
                    setLoggedIn(data);
                }).catch(e => {
                    if (e.message === "Unauthorized request") {
                        //navigate("/login");
                        alert("Unauthorized Request");
                    } else {
                        alert(`${e.message}. Please reload the page`);
                    }
                });

            fetch(`http://127.0.0.1:10001/project/${ticket.project}`, { method: "GET", credentials: "include", })
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
        }
    }, [ticket])

    useEffect(() => {
        if (typeof (project.admin) !== 'undefined') {
            console.log(loggedIn.uid)
            console.log(user.uid);
            setAssigned(loggedIn.uid === user.uid);
            console.log(project.admin.includes(loggedIn.uid))
            setAdmin(project.admin.includes(loggedIn.uid));
        }
    }, [project, loggedIn, user]);


    function markCompleted(ticket) {
        return function () {
            fetch("http://127.0.0.1:10001/ticket/update/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tid: ticket.tid,
                    completed: true,
                })
            });

            //navigate(`/dashboard`);
        };
    }


    return (
        <div className={styles.outerContainer}>
            <Topbar page_name="Ticket" className={styles.topbar} />
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
                    <span className={styles.metadataValue}>{user.display_name}</span>
                </div>

                {/* Divider */}
                <hr className={styles.divider} />

                {/* Description */}
                <div className={styles.descriptionContainer}>
                    <span className={styles.metadataLabel}>Description:</span>
                    <p className={styles.descriptionText}>{ticket.description}</p>
                </div>

                <div className={styles.buttonContainer}>
                    {isAssigned ? <button className={styles.contactButton} onClick={() => navigate(`/contactadmin?tid=${tid}`)} type="button">Contact Admin</button> : null}
                    {isAdmin ? <button className={styles.editButton} onClick={() => navigate(`/ticketedit?tid=${tid}`)} type="button">Edit Ticket</button> : null}
                    {isAssigned ? <button className={styles.completeButton} onClick={markCompleted(ticket)} type="button">Mark as Complete</button> : null}
                </div>
            </div>
        </div>
    );
}

export default FullTicket