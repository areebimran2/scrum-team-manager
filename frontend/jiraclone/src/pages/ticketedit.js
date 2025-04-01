import { React, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from "../styles/ticketedit.module.css";
import { Topbar } from "../components/topbar";
import SearchableDropdown from "../components/SearchableDropdown";

export function TicketEdit() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const [ticket, setTicket] = useState({ title: "temp", description: "temp" });

    const [priority, setPriority] = useState();
    const [storyPoints, setStoryPoints] = useState();
    const [assigned, setAssigned] = useState();

    const [httpCode, setHttpCode] = useState();

    const [searchParams, setSearchParams] = useSearchParams();
    const tid = searchParams.get("tid");

    // load in the possible users to assign the ticket to 
    const [users, setUsers] = useState(["temp1", "temp2", "temp3"]);
    const [project, setProject] = useState({});
    const [projectMembers, setProjectMembers] = useState([]);
    const [pid, setPid] = useState();
    const [user, setUser] = useState({});

    const storyPointsOptions = ["1", "2", "4", "8", "16", "32", "64", "128", "256", "512", "1024"];
    // possible priorities 
    const priorityOptions = ["1", "2", "3", "4", "5"];

    useEffect(() => {

        fetch(`http://127.0.0.1:10001/ticket/${tid}`, { method: "GET" })
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
                setPid(data.project);
                setPriority(data.priority);
                setStoryPoints(data.story_points);
                console.log(data);
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
        if (typeof (ticket) !== "undefined" && typeof(pid) !== "undefined") {
            if (ticket.assigned !== -1) {
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

            fetch(`http://127.0.0.1:10001/project/${pid}`, { method: "GET", credentials: "include", })
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

            fetch(`http://127.0.0.1:10001/project/${pid}/members`, { method: "GET", credentials: "include", })
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
                    setProjectMembers(data.members);
                    setUsers(data.members.map(member => member.display_name))
                }).catch(e => {
                    if (e.message === "Unauthorized request") {
                        navigate("/login");
                        alert("Unauthorized Request");
                    } else {
                        alert(`${e.message}. Please reload the page`);
                    }
                });
        }

    }, [pid])

    function onSubmit(data) {
        const body = { tid: ticket.tid };
        const assign_body = { tid: ticket.tid}

        if (data.ticketName) {
            body.title = data.ticketName;
        }
        if (data.description) {
            body.description = data.description;
        }
        if (priority) {
            body.priority = priority;
        }
        if (storyPoints) {
            body.story_points = storyPoints;
        }
        if (assigned) {
            const assignedUser = projectMembers.find(member => member.display_name === assigned);

            if (assignedUser) {
                assign_body.assigned = assignedUser.uid;
            }
        }

        fetch("http://127.0.0.1:10001/ticket/update/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        fetch(`http://127.0.0.1:10001/project/${pid}/assign/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(assign_body),
            credentials: "include"
        });

        navigate(`/ticket?tid=${tid}`);
    }

    function deleteTicket() {
        // write the function to pull up the confirm page for deleting the project.
        fetch(`http://127.0.0.1:10001/ticket/${tid}`, { method: "DELETE", credentials: "include" })
            .then(response => {
                setHttpCode(response.status);
            });

        if (httpCode !== 200) {
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
            <Topbar page_name="Ticket Edit" />
            <div className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                    <textarea name="ticketName" placeholder={ticket.title} onInput={handleInput} rows={1} {...register("ticketName")} className={styles.ticketName} />

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
                        <h1 className={styles.subtitles} style={{ "justify-self": "end" }}>Story Point Estimate:</h1>
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
                            selectedVal={assigned}
                            handleChange={(val) => setAssigned(val)}
                            className={styles.dropdown}
                            inputClassName={styles.assignInput}
                            optionsClassName={styles.assignOptions}
                            arrowClassName={styles.arrow}
                        />
                    </div>

                    <hr className={styles.line} />
                    <h1 className={styles.subtitles}>Description: </h1>
                    <textarea name="description" placeholder={ticket.description} onInput={handleInput} {...register("description")} className={styles.description} />
                    <div className={styles.buttons}>
                        <Popup trigger={<button type="button" className={styles.deletebutton}>Delete Ticket</button>} modal nested>
                            {
                                // https://react-popup.elazizi.com/css-styling <= Source for popup styling. Do in global.css, as I haven't yet figured
                                // out how to do it in the module.css file.
                                close => (
                                    <div className={styles.modal}>
                                        <button className={styles.cancelbutton} onClick={() => close()} type="button">Cancel Deletion</button>
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