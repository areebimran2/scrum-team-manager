import { React, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from "../styles/ticketedit.module.css";
import { Topbar } from "../components/topbar";

export function TicketEdit() {
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();

    const [ticket, setTicket] = useState({title:"temp", description:"temp"});
    const [httpCode, setHttpCode] = useState();

    const [searchParams, setSearchParams] = useSearchParams();
    const pid = searchParams.get("pid")
    const tid = searchParams.get("tid");

    useEffect (() => {
    
            fetch(`http://127.0.0.1:10001/ticket/${tid}`, {method: "GET"})
                .then(response => {
                    if (response.status === 401){
                        throw new Error("Unauthorized request");
                    } else if (response.status !== 200){
                        throw new Error(`API error: ${response.status}`);
                    } else {
                        return response.json;
                    }
                })
                .then(data => {
                    setTicket(data);
                }).catch(e => {
                    if (e.message === "Unauthorized request"){
                        navigate("/login");
                    } else {
                        setTicket({title:"Server Error", description:"Server Error"});
                        alert(`${e.message}. Please reload the page`);
                    }
                })
        }, []);

    function onSubmit(data) {
        // write the POST request in here.
        // also replace this with whatever it takes to go to the correct project page.
       
        fetch("http://127.0.0.1:10001/ticket/update/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tid:ticket.tid,
                title:data.ticketName,
                description:data.description,
                assigned_to:ticket.assigned_to,
                story_points:ticket.story_points,
                creator:ticket.creator,
                priority:ticket.priority,
                date_created:ticket.date_created,
                completed:ticket.completed,
                date_completed:ticket.date_completed,
                date_assigned:ticket.date_assigned,
                assigned:ticket.assigned
            })
        })
        .then(response => {
            setHttpCode(response.status);
        });

        if (httpCode !== 200){
            alert(`Server Error: ${httpCode}. Please try again`);
            return;
        }

        navigate(`/ticket?pid=${pid}&tid=${tid}`);
    }

    function deleteTicket() {
        // write the function to pull up the confirm page for deleting the project.
        fetch(`http://127.0.0.1:10001/ticket/delete/${tid}`, {method: "GET"})
        .then(response => {
            setHttpCode(response.status);
        });

        if (httpCode !== 200){
            alert(`Server Error: ${httpCode}. Please try again`);
            return;
        }

        navigate("/dashboard");

    }

    // I don't know how the page knows what project it is so I can't do it myself but 
    // in the inputs add an attribute "value={WHATEVER IT IS}"
    // so like if it's a variable called "project" with field "name" do 
    // value={project.name}
    // you get the point 

    // Also it would be cool if you could make the text area adjust its height according to the amount of text that's in it. 
    // There's tutorials online and also an npm package i think? But I'm gonna be honest I have no idea how to do that. 
    return (
        <div>
            <Topbar page_name="Ticket Edit"/>
            <div className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <input type="text" placeholder="Ticket Name" name="ticketName" value={ticket.title} {...register("ticketName")} className={styles.ticketName}/>
                    <hr className={styles.line}/>
                    <h1 className={styles.descriptiontitle}>Description: </h1>
                    <textarea placeholder="Description" name="description" value={ticket.description} {...register("description")} className={styles.description}/>
                    <div className={styles.buttons}>
                        <Popup trigger={ <button type="button" className={styles.deletebutton}>Delete Project</button> } modal nested>
                        {
                            // https://react-popup.elazizi.com/css-styling <= Source for popup styling. Do in global.css, as I haven't yet figured
                            // out how to do it in the module.css file.
                            close => (
                                <div className={styles.modal}>
                                    <button className={styles.cancelbutton} onClick={()=>close()} type="button">Cancel Deletion</button>
                                    <button className={styles.confirmbutton} onClick={handleSubmit(deleteTicket)} type="button">Confirm Deletion</button>
                                </div>
                            )
                        } 
                        </Popup>
                        <button type="submit" className={styles.submitbutton}>Save Changes</button>                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TicketEdit;