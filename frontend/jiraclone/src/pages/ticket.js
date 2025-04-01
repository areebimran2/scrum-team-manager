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
        title: "",
        description: "",
        story_points: 16,
        priority: 2
    });
    const [isAdmin, setAdmin] = useState(true);
    const [isAssigned, setAssigned] = useState(true);
    const [isComplete, setComplete] = useState(false);
    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState({});
    const [project, setProject] = useState({});
    const [macButton, setMacButton] = useState(true);

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
                setComplete(data.completed);
                console.log(`SET COMPLETE: ${isComplete}`)
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
            setMacButton(loggedIn.uid === user.uid && !isComplete);
            console.log(`assigned ${isAssigned}`);
            console.log(`complete ${isComplete}`)
        }
    }, [project, loggedIn, user]);


    function markCompleted(ticket) {
        return function () {
            let response = fetch("http://127.0.0.1:10001/ticket/update/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tid: ticket.tid,
                    completed: true,
                })
            })
            .then(response => {
                if (response.status === 401) {
                    throw new Error("Unauthorized request");
                } else if (response.status !== 200) {
                    throw new Error(`API error: ${response.status}`);
                } else {
                    navigate(`/dashboard`);
                }
            });
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
                    <span style={{ flex: 1 }}></span> {/* Spacer */}
                    <span className={styles.metadataLabel}>Completion status:</span>
                    {isComplete ? <span className={styles.metadataValue}>Complete</span> : <span className={styles.metadataValue}>Incomplete</span>}
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
                    {macButton ? <button className={styles.completeButton} onClick={markCompleted(ticket)} type="button">Mark as Complete</button> : null}
                </div>
            </div>
        </div>
    );
}

export default FullTicket