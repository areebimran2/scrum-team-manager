import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from "../styles/projectedit.module.css";
import { Topbar } from "../components/topbar";
import { GetProjects } from "../components/getProjects";

export function ProjectEdit() {
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();

    const [searchParams, setSearchParams] = useSearchParams();
    const pid = searchParams.get("pid")

    const project = GetProjects([pid]);

    function onSubmit(data) {
        // write the POST request in here.
        // also replace this with whatever it takes to go to the correct project page.

        let response = fetch("http://127.0.0.1:10001/project/update/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pid: pid,
                name: data.projectName,
                description: data.description
            })
        });

        navigate(`/project?pid=${pid}`);
    }

    function deleteProject() {
        // write the function to pull up the confirm page for deleting the project.
        let response = fetch(`http://127.0.0.1:10001/project/delete/${pid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pid: pid,
            })
        });

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
            <Topbar page_name="Project Edit"/>
            <div className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <input type="text" placeholder="Project Name" value={project.name} name="projectName" {...register("projectName")} className={styles.projectName}/>
                    <hr className={styles.line}/>
                    <h1 className={styles.descriptiontitle}>Description: </h1>
                    <textarea placeholder="Description" value={project.description} name="description" {...register("description")} className={styles.description}/>
                    <div className={styles.buttons}>
                        <Popup trigger={ <button type="button" className={styles.deletebutton}>Delete Project</button> } modal nested>
                        {
                            // https://react-popup.elazizi.com/css-styling <= Source for popup styling. Do in global.css, as I haven't yet figured
                            // out how to do it in the module.css file.
                            close => (
                                <div className={styles.modal}>
                                    <button className={styles.cancelbutton} onClick={()=>close()} type="button">Cancel Deletion</button>
                                    <button className={styles.confirmbutton} onClick={handleSubmit(deleteProject)} type="button">Confirm Deletion</button>
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

export default ProjectEdit;