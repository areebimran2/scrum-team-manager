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

    const [project, setProject] = useState({name:"Test Project", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ", admin:[4, 5], scrum_user:[1,2,3]});
    const [tickets, setTickets] = useState([
        {
          tid: 1,
          title: 'Ticket 1',
          assigned: 'User 1',
          completed: true,
          story_points: 32,
          priority: 1,
          description: 'This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card. This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card. This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card.'
        },
        {
          tid: 2,
          title: 'Ticket 2',
          assigned: 'User 2',
          completed: false,
          story_points: 64,
          priority: 1,
          description: 'This is the description for ticket 2'
        },
        {
          tid: 3,
          title: 'Ticket 3',
          assigned: 'User 2',
          completed: true,
          story_points: 32,
          priority: 2,
          description: 'This is the description for ticket 3'
        },
        {
          tid: 4,
          title: 'Ticket 4',
          assigned: 'User 1',
          completed: false,
          story_points: 16,
          priority: 3,
          description: 'This is the description for ticket 4'
        }
    ]);

    // useEffect (() => {

    //     fetch(`http://127.0.0.1:10001/project/${pid}`, {method: "GET"})
    //         .then(response => {
    //             if (response.status === 401){
    //                 throw new Error("Unauthorized request");
    //             } else if (response.status !== 200){
    //                 throw new Error(`API error: ${response.status}`);
    //             } else {
    //                 return response.json;
    //             }
    //         })
    //         .then(data => {
    //             setProject(data);
    //             setTickets([]);
    //         }).catch(e => {
    //             if (e.message === "Unauthorized request"){
    //                 navigate("/login");
    //             } else {
    //                 navigate("/dashboard");
    //             }
    //         });

    //     let counter;
    //     let tid;
    //     for (counter = 0; counter < project.tickets.length; counter++){
    //         tid = project.tickets[counter];
    //         fetch(`http://127.0.0.1:10001/tickets/${tid}`, {method: "GET"})
    //         .then(response => {
    //             if (response.status === 401){
    //                 throw new Error("Unauthorized request");
    //             } else if (response.status !== 200){
    //                 throw new Error(`API error: ${response.status}`);
    //             } else {
    //                 return response.json;
    //             }
    //         })
    //         .then(data => {
    //             setTickets([
    //                 ...tickets,
    //                 data
    //             ]
    //             )
    //         }).catch(e => {
    //             if (e.message === "Unauthorized request"){
    //                 navigate("/login");
    //             } else {
    //                 navigate("/dashboard");
    //             }
    //         });
    //     }

    // }, []);

    function onEditClick() {
        // as always, edit this as needed
        navigate(`/projectedit?pid=${pid}`);
    }

    function onNewClick(tid) {
        // definitely edit this, gotta make a new ticket and all that 
        navigate("/ticketedit?tid=new");
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
                        <button onClick={onNewClick} className={styles.ticketbutton}>New Ticket +</button> 
                    </div>
                    <div className={styles.ticketInfo}>
                        <p className={styles.ticketTitle}>Ticket</p>
                        <p className={styles.categories}>Assignee</p>
                        <p className={styles.categories}>Completed</p>
                        <p className={styles.categories}>Priority</p>
                        <p className={styles.categories}>SP</p>
                    </div>
                    <div className={styles.innerContainer}>
                        <TicketView tickets={ tickets } mode="project"/>
                    </div>
                </div>

                <div className={styles.sidepanel}>
                    <button onClick={onEditClick} className={styles.sidebutton}>Edit Project</button>
                    <div className={styles.users}>
                        <UserView inputProject={ project }/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProject;
