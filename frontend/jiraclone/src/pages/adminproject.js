import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import { Topbar } from '../components/topbar';
import { TicketView } from '../components/ticketview';
import { UserView } from '../components/users';
import { BarGraph } from '../components/BarGraph';
import styles from '../styles/adminproject.module.css';

export function AdminProject() {
    const navigate = useNavigate();

    function onEditClick() {
        // as always, edit this as needed
        navigate("/projectedit", {replace: false});
        // they can probably still navigate back to the project on the back button? so replace: false
    }

    function onNewClick() {
        // definitely edit this, gotta make a new ticket and all that 
        navigate("/ticketedit", {replace: false});
        // they can probably still navigate back to the project on the back button? so replace: false
    }

    function onDeleteClick() {
        // show the pop up for confirmation and delete the project
    }


    // This is for testing, but also 
    // Assigned is currently an integer, I can only assume that's the user's uid
    // I frankly do not know how to change that but good luck!
    const tickets = [
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
    ];

    // edit top bar's page name to be the name of the project 
    // will add the user's portion but that's a different feature 
    return (
        <div>
            <Topbar page_name={"Project Name"}/>
            <div className={styles.projectpage}>
                <div className={styles.mainbody}>
                    <p className={styles.description}>
                        Load the project description into this part by replacing this text with it. Wahooooooo
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
                    <button onClick={onEditClick} className={styles.editbutton}>Edit Project</button>
                    <div className={styles.users}>
                        <UserView />
                    </div>
                    <button onClick={onDeleteClick} className={styles.deletebutton}>Delete Project</button>
                </div>
            </div>
        </div>
    );
}

export default AdminProject;
