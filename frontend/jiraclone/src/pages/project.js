import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import { Topbar } from '../components/topbar';
import { TicketView } from '../components/ticketview';
import styles from "../styles/project.module.css";

export function Project() {
    // get the project however it is you do you magic wizard man 
    const project = {
        pid: 1,
        name: "Project 1",
        description: "This is the description for our glorious sample project. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        tickets: [
            {
                tid: 1,
                title: 'Ticket 1',
                description: 'This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card.',
                assigned_to: 123,
                completed: true,
                priority: 1,
                SP: 1,
            },
            {
                tid: 2,
                title: 'Ticket 2',
                description: 'This is the description for ticket 2. It outlines the requirements and tasks needed to complete this ticket. The description is lengthy to ensure proper layout testing.',
                assigned_to: 456,
                completed: false,
                priority: 2,
                SP: 2,
            },
            {
                tid: 3,
                title: 'Ticket 3',
                description: 'Ticket 3 focuses on the implementation of new features in the project. The description is purposely long to test the card layout.',
                assigned_to: 123,
                completed: true,
                priority: 3,
                SP: 3,
            },
            {
                tid: 4,
                title: 'Ticket 4',
                description: 'This ticket involves fixing bugs reported by users. The details provided here are extensive to ensure everything is covered and easy to read.',
                assigned_to: 789,
                completed: false,
                priority: 2,
                SP: 2,
            },
            {
                tid: 5,
                title: 'Ticket 5',
                description: 'This is a long description for ticket 5, describing the tasks involved in improving the user interface and user experience of the application.',
                assigned_to: 101,
                completed: false,
                priority: 1,
                SP: 3,
            },
            {
                tid: 6,
                title: 'Ticket 6',
                description: 'For ticket 6, the goal is to enhance performance. The description provides insights into the required tasks and the testing process.',
                assigned_to: 123,
                completed: true,
                priority: 1,
                SP: 5,
            },
        ],
        creator: 2,
        date_created: new Date().toISOString(),
        scrum_user: [],
        admin: []
    };
    // get the list of tickets for a project 
    const tickets = project.tickets;

    // filter for tickets specific to the user 
    const userUid = 123; // Replace with actual user UID retrieval logic
    const myTickets = tickets
        .filter(ticket => ticket.assigned_to === userUid)
        .sort((a, b) => a.priority - b.priority);
    const otherTickets = tickets
        .filter(ticket => ticket.assigned_to !== userUid)
        .sort((a, b) => a.priority - b.priority);

    return (
        <div>
            <Topbar page_name={project.name}/>
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
                        <TicketView tickets={ myTickets } mode="project" />                        
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
                        <TicketView tickets={ otherTickets } mode="project" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project;