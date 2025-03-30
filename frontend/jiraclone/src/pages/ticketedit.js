import { React, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from "../styles/ticketedit.module.css";
import { Topbar } from "../components/topbar";
import SearchableDropdown from "../components/SearchableDropdown";

export function TicketEdit() {
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();

    const [ticket, setTicket] = useState({title:"temp", description:"temp"});

    const [priority, setPriority] = useState(ticket.priority);
    const [storyPoints, setStoryPoints] = useState(ticket.story_points);
    const [assignedTo, setAssignedTo] = useState(ticket.assigned_to);

    const [httpCode, setHttpCode] = useState();

    const [searchParams, setSearchParams] = useSearchParams();
    const pid = searchParams.get("pid")
    const tid = searchParams.get("tid");

    // load in the possible users to assign the ticket to 
    const [users, setUsers] = useState(["temp1", "temp2", "temp3"]);

    // SORRY THIS IS SO JANK BUT THE DROPDOWN NEEDS TO BE A STRING AND I DON'T KNOW HOW TO CHANGE THE DROPDOWN SEARCH FUNCTION 
    // SO YOU MIGHT NEED TO CHANGE THE VALUE TO AN INTEGER BEFORE YOU SEND IT TO BACKEND 
    // possible story points 
    const storyPointsOptions = ["1", "2", "4", "8", "16", "32", "64", "128", "256", "512", "1024"];
    // possible priorities 
    const priorityOptions = ["1", "2", "3", "4", "5"];

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

    // this is for that super cool auto-resizing text area I wanted to make :3
    const handleInput = (e) => { 
        e.target.style.height = "auto"; // Reset the height to auto to calculate the new height
        e.target.style.height = `${e.target.scrollHeight - 16}px`; // Set the height to the scroll height
    }

    return (
        <div>
            <Topbar page_name="Ticket Edit"/>
            <div className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                    <textarea placeholder="Ticket Name" name="ticketName" defaultValue={ticket.title} onInput={handleInput} rows={1} {...register("ticketName")} className={styles.ticketName}/>

                    <div className={styles.prioritySP}>
                        <h1 className={styles.subtitles}>Priority:</h1>
                        <SearchableDropdown
                            options={priorityOptions.map((priority) => ({ name: priority }))} 
                            label="name"
                            selectedVal={priority}
                            handleChange={(val) => setPriority(val)}
                            className={styles.priorityDropdown}
                            inputClassName={styles.priorityInput}
                            optionsClassName={styles.priorityOptions}
                            arrowClassName={styles.arrow}
                        />
                        <h1 className={styles.subtitles} style={{"justify-self": "end"}}>Story Point Estimate:</h1>
                        <SearchableDropdown
                            options={storyPointsOptions.map((points) => ({ name: points }))} 
                            label="name"
                            selectedVal={storyPoints}
                            handleChange={(val) => setStoryPoints(val)}
                            className={styles.dropdown}
                            inputClassName={styles.storyInput}
                            optionsClassName={styles.storyOptions}
                            arrowClassName={styles.arrow}
                        />
                    </div>
                    <div className={styles.assignments}>
                        <h1 className={styles.subtitles}>Assigned to: </h1>
                        <SearchableDropdown
                            options={users.map((user) => ({ name: user }))} 
                            label="name"
                            selectedVal={assignedTo}
                            handleChange={(val) => setAssignedTo(val)}
                            className={styles.dropdown}
                            inputClassName={styles.assignInput}
                            optionsClassName={styles.assignOptions}
                            arrowClassName={styles.arrow}
                        />
                    </div>    

                    <hr className={styles.line}/>
                    <h1 className={styles.subtitles}>Description: </h1>
                    <textarea placeholder="Description" name="description" defaultValue={ticket.description} onInput={handleInput} {...register("description")} className={styles.description}/>
                    <div className={styles.buttons}>
                        <Popup trigger={ <button type="button" className={styles.deletebutton}>Delete Ticket</button> } modal nested>
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