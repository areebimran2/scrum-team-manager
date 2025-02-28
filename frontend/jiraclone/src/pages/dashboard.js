import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../components/topbar';
import { TicketView } from '../components/ticketview.js';
import { ProjectView } from '../components/projectview.js';
import styles from '../styles/dashboard.module.css';
import defaultProfilePic from '../assets/defaultProfilePic.png';

export function Dashboard(props) {
    const navigate = useNavigate();

  /**
   * I think what needs to be done here is:
   * 1. make a GET request for the user's information 
   * 2. load the information into the correct components (eg. <TicketView tickets={user.tickets} /> I think?) 
   * 
   * REMEMBER TO EDIT ALL THE PLACEHOLDER VALUES 
   * Also uncomment the parts as they are added (skills page redirect button) 
   */

        // This will need to be changed when tickets are implemented and can be loaded for the specific user, this was just for testing
        const tickets = [
          {
            tid: 1,
            title: 'Ticket 1',
            project: 'Project 1',
            completed: true,
            story_points: 32,
            priority: 1,
            description: 'This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card. This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card. This is the description for ticket 1. It has a lot of text in its description. This is because it is very long and needs to be long enough to test the layout of the ticket card.'
          },
          {
            tid: 2,
            title: 'Ticket 2',
            project: 'Project 2',
            completed: false,
            story_points: 64,
            priority: 1,
            description: 'This is the description for ticket 2'
          },
          {
            tid: 3,
            title: 'Ticket 3',
            project: 'Project 1',
            completed: true,
            story_points: 32,
            priority: 2,
            description: 'This is the description for ticket 3'
          },
          {
            tid: 4,
            title: 'Ticket 4',
            project: 'Project 1',
            completed: false,
            story_points: 16,
            priority: 3,
            description: 'This is the description for ticket 4'
          }
        ];

        // Change this as well, this is just to test projects 
        const projects = [
          {
            pid: 1,
            name: 'Project 1'
          },
          {
            pid: 2,
            name: 'Project 2'
          }
        ];

    function onProfileClick() {
        navigate("/profile");
    }

    function onSkillsClick() {
        // page doesn't exist yet, hence the comment.
        // navigate("skills", {replace: true}); 
    }

/**
 * REMEMBER TO CHANGE THE PLACEHOLDER VALUES 
 * 
 * Specifically: 
 * default profile pic and display name 
 */
  return (
    <div>
        <Topbar page_name="Dashboard" className={styles.topbar}/>
        <div className={styles.dashboard}>
            <div className={styles.projectContainer}>
                <h1 className={styles.header}>Projects</h1>
                <div className={styles.projectsOuter}>
                  <ProjectView projects={projects}/>
                </div>
            </div>

            <div className={styles.profileContainer}>
                <img src={defaultProfilePic} className={styles.profilePic}/>
                <h2 className={styles.header2}>Display Name</h2>
                <button onClick={onProfileClick} className={styles.button}>Edit Profile</button>
            </div>

            <div className={styles.ticketContainer}>
                <h1 className={styles.header}>Tickets</h1>
                <div className={styles.ticketInfo}>
                  <p className={styles.ticketTitle}>Ticket</p>
                  <p className={styles.categories}>Project</p>
                  <p className={styles.categories}>Completed</p>
                  <p className={styles.categories}>Priority</p>
                  <p className={styles.categories}>SP</p>
                </div>
                <div className={styles.innerContainer}>
                    <TicketView tickets={tickets} mode="dashboard"/>
                </div>
            </div>
        
            <div className={styles.skillsContainer}>
                <h2 className={styles.header2}>Skills</h2>
                <button onClick={onSkillsClick} className={styles.button}>Edit Skills</button>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;