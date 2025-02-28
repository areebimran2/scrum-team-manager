import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import { Topbar } from '../components/topbar';
import { TicketListView } from '../components/TicketListView.js'
import { ProjectView } from '../components/projectview.js';
import styles from '../styles/projectlist.module.css';
import defaultProfilePic from '../assets/defaultProfilePic.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



export default function ProjectList() {

    // to connect, there should be a list of users tickets and other tickets
    const userTickets = [
        {
            tid: 1,
            title: 'Ticket 1',
            description: 'This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card.',
            completed: true,
            priority: 1,
            SP: 1,
        },
        {
            tid: 2,
            title: 'Ticket 2',
            description: 'This is the description for ticket 2. It outlines the requirements and tasks needed to complete this ticket. The description is lengthy to ensure proper layout testing.',
            completed: false,
            priority: 2,
            SP: 2,
        },
        {
            tid: 3,
            title: 'Ticket 3',
            description: 'Ticket 3 focuses on the implementation of new features in the project. The description is purposely long to test the card layout.',
            completed: true,
            priority: 3,
            SP: 3,
        },
        {
            tid: 4,
            title: 'Ticket 4',
            description: 'This ticket involves fixing bugs reported by users. The details provided here are extensive to ensure everything is covered and easy to read.',
            completed: false,
            priority: 2,
            SP: 2,
        },
        {
            tid: 5,
            title: 'Ticket 5',
            description: 'This is a long description for ticket 5, describing the tasks involved in improving the user interface and user experience of the application.',
            completed: false,
            priority: 1,
            SP: 3,
        },
        {
            tid: 6,
            title: 'Ticket 6',
            description: 'For ticket 6, the goal is to enhance performance. The description provides insights into the required tasks and the testing process.',
            completed: true,
            priority: 1,
            SP: 5,
        },
    ]


    const tickets = [
        {
            tid: 1,
            title: 'Ticket 1',
            description: 'This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card.',
            completed: true,
            priority: 1,
            SP: 1,
        },
        {
            tid: 2,
            title: 'Ticket 2',
            description: 'This is the description for ticket 2. It outlines the requirements and tasks needed to complete this ticket. The description is lengthy to ensure proper layout testing.',
            completed: false,
            priority: 2,
            SP: 2,
        },
        {
            tid: 3,
            title: 'Ticket 3',
            description: 'Ticket 3 focuses on the implementation of new features in the project. The description is purposely long to test the card layout.',
            completed: true,
            priority: 3,
            SP: 3,
        },
        {
            tid: 4,
            title: 'Ticket 4',
            description: 'This ticket involves fixing bugs reported by users. The details provided here are extensive to ensure everything is covered and easy to read.',
            completed: false,
            priority: 2,
            SP: 2,
        },
        {
            tid: 5,
            title: 'Ticket 5',
            description: 'This is a long description for ticket 5, describing the tasks involved in improving the user interface and user experience of the application.',
            completed: false,
            priority: 1,
            SP: 3,
        },
        {
            tid: 6,
            title: 'Ticket 6',
            description: 'For ticket 6, the goal is to enhance performance. The description provides insights into the required tasks and the testing process.',
            completed: true,
            priority: 1,
            SP: 5,
        },
    ]



    return (

        <div className={styles.outer}>
            <Topbar page_name="Project" className={styles.topbar} />


            <div className={styles.projectContainer}>
                <h1 className={styles.header}>My Tickets</h1>
                <Row className={styles.exampleHeader}>
                    <Col xs={9}>Ticket</Col>
                    <Col xs={1}>Completed</Col>
                    <Col xs={1}>Priority</Col>
                    <Col xs={1}>SP</Col>
                </Row>
                <Container fluid className='ticketContainer'>
                    {userTickets.map(ticket => (
                        <TicketListView id={ticket.tid}
                            description={ticket.description}
                            completed={ticket.completed}
                            priority={ticket.priority}
                            story_points={ticket.SP}
                        ></TicketListView>
                    ))}

                </Container>



            </div>

            <div className={styles.projectContainer}>
                <h1 className={styles.header}>Other Tickets</h1>
                <Row className={styles.exampleHeader}>
                    <Col xs={7}>Ticket</Col>
                    <Col xs={2}>Assigned</Col>
                    <Col xs={1}>Completed</Col>
                    <Col xs={1}>Priority</Col>
                    <Col xs={1}>SP</Col>
                </Row>
                <Container fluid className='ticketContainer'>
                    {userTickets.map(ticket => (
                        <TicketListView id={ticket.tid}
                            description={ticket.description}
                            assigned={"User" + ticket.tid}
                            completed={ticket.completed}
                            priority={ticket.priority}
                            story_points={ticket.SP}
                        ></TicketListView>
                    ))}

                </Container>



            </div>

        </div>

    )
}