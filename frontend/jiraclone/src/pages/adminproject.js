import { React, useEffect, useState } from "react";
import ReactDOM from 'react-dom/client';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Topbar } from '../components/topbar';
import { TicketView } from '../components/ticketview';
import { UserView } from '../components/users';
import { BarGraph } from '../components/BarGraph';
import styles from '../styles/adminproject.module.css';

export function AdminProject() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const pid = searchParams.get("pid")
    const [project, setProject] = useState({name:"", description:"", admin:[], scrum_users :[]});
    const [tickets, setTickets] = useState([]);
    const [members, setMembers] = useState([]);
    const [user, setUser] = useState({});

    useEffect (() => {

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
                setUser(data);
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
                if (response.status === 401){
                    throw new Error("Unauthorized request");
                } else if (response.status !== 200){
                    throw new Error(`API error: ${response.status}`);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                setProject(data[0]);
            }).catch(e => {
                if (e.message === "Unauthorized request"){
                    navigate("/login");
                } else {
                    navigate("/dashboard");
                }
            });

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
                console.log(data);
                setTickets(data.tickets);
            }).catch(e => {
                if (e.message === "Unauthorized request") {
                    navigate("/login");
                    alert("Unauthorized Request");
                } else {
                    alert(`${e.message}. Please reload the page`);
                }
            });

            fetch(`http://127.0.0.1:10001/project/${pid}/members/`, { method: "GET", credentials: "include", })
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
                setMembers(data.members);
                console.log(data.members);
            }).catch(e => {
                if (e.message === "Unauthorized request") {
                    navigate("/login");
                } else {
                    navigate("/dashboard");
                }
            });

    }, []);

    useEffect(() => console.log(tickets), [tickets])

    function onEditClick() {
        // as always, edit this as needed
        navigate(`/projectedit?pid=${pid}`);
    }

    function onNewClick(uid, pid) {
        return function () {
            fetch("http://127.0.0.1:10001/ticket/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project: pid,
                    creator: uid
                }),
                credentials: "include"
            })
                .then(response => response.json())
                .then(data => navigate(`/ticketedit?tid=${data.tid}`))
        }
    }

    // edit top bar's page name to be the name of the project 
    // will add the user's portion but that's a different feature 
    return (
        <div>
            <Topbar page_name={ project.name }/>
            <div className={styles.projectpage}>
                <div className={styles.mainbody}>
                    <p className={styles.description}>
                        {project.description}
                    </p>
                    <h1 className={styles.headings}>Performance</h1>
                    <div className={styles.innerContainer}>
                        <BarGraph />
                    </div>

                    <div className={styles.ticketStuff}>
                        <h1 className={styles.headings}>Tickets</h1>
                        <button onClick={onNewClick(user.uid, project.pid)} className={styles.ticketbutton}>New Ticket +</button> 
                    </div>
                    <div className={styles.ticketInfo}>
                        <p className={styles.ticketTitle}>Ticket</p>
                        <p className={styles.categories}>Assignee</p>
                        <p className={styles.categories}>Completed</p>
                        <p className={styles.categories}>Priority</p>
                        <p className={styles.categories}>SP</p>
                    </div>
                    <div className={styles.innerContainer}>
                        <TicketView input={ tickets } mode="project" pid={pid} inputMembers={members}/>
                    </div>
                </div>

                <div className={styles.sidepanel}>
                    <button onClick={onEditClick} className={styles.editbutton}>Edit Project</button>
                    <div className={styles.users}>
                        <UserView pid={ pid }/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProject;
