import { React, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Topbar } from '../components/topbar';
import { TicketView } from '../components/ticketview.js';
import { ProjectView } from '../components/projectview.js';
import styles from '../styles/dashboard.module.css';
import defaultProfilePic from '../assets/defaultProfilePic.png';


export function Dashboard(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState({email:"", uid:null, assigned_tickets:{}});
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  let temp;

  /**
   * I think what needs to be done here is:
   * 1. make a GET request for the user's information 
   * 2. load the information into the correct components (eg. <TicketView tickets={user.tickets} /> I think?) 
   * 
   * REMEMBER TO EDIT ALL THE PLACEHOLDER VALUES 
   * Also uncomment the parts as they are added (skills page redirect button) 
   */
        

  function onProfileClick() {
      navigate("/profile");
  }

  function onSkillsClick() {
      // page doesn't exist yet, hence the comment.
      // navigate("skills", {replace: true}); 
  }

  useEffect(() => {
    fetch(`http://127.0.0.1:10001/userprofile/`, {method: "GET", credentials: "include",})
    .then(response => {
        if (response.status === 401){
            throw new Error("Unauthorized request");
        } else if (response.status !== 200){
            throw new Error(`API error: ${response.status}`);
        } else {
            return response.json();
        }})
    .then(data => {
        setProjects(data);
    }).catch(e => {
        if (e.message === "Unauthorized request"){
            navigate("/login");
            alert("Unauthorized Request");
        } else {
            alert(`${e.message}. Please reload the page`);
        }
    });
  }, []);

  useEffect(()=>{
    fetch(`http://127.0.0.1:10001/userprojects/`, {method: "GET", credentials: "include",})
    .then(response => {
        if (response.status === 401){
            throw new Error("Unauthorized request");
        } else if (response.status !== 200){
            throw new Error(`API error: ${response.status}`);
        } else {
            return response.json();
        }})
    .then(data => {
        setProjects(data);
    }).catch(e => {
        if (e.message === "Unauthorized request"){
            navigate("/login");
            alert("Unauthorized Request");
        } else {
            alert(`${e.message}. Please reload the page`);
        }
    });

    for (let counter = 0; counter < user.assigned_tickets; counter ++){
      let tid = user.assigned_tickets[counter];

      fetch(`http://127.0.0.1:10001/ticket/${tid}`, {method: "GET", credentials: "include",})
        .then(response => {
            if (response.status === 401){
                throw new Error("Unauthorized request");
            } else if (response.status !== 200){
                throw new Error(`API error: ${response.status}`);
            } else {
                return response.json();
            }})
        .then(data => {
            setTickets([
              ...tickets,
              data
            ]);
        }).catch(e => {
            if (e.message === "Unauthorized request"){
                navigate("/login");
                alert("Unauthorized Request");
            } else {
                alert(`${e.message}. Please reload the page`);
            }
        });
      }

  }, [user])


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
                  <ProjectView input={projects}/>
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
                    <TicketView input={tickets} mode="dashboard"/>
                </div>
            </div>
        
            <div className={styles.skillsContainer}>
                <h2 className={styles.header2}>Skills</h2>
                <button onClick={(onSkillsClick)} className={styles.button}>Edit Skills</button>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;