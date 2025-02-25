import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/projectedit.module.css";
import { Topbar } from "../components/topbar";

export function ProjectEdit() {
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();

    function onSubmit(data) {
        // write the POST request in here.
        // also replace this with whatever it takes to go to the correct project page.
        navigate("project", {replace: true});
    }

    function onClick() {
        // write the function to pull up the confirm page for deleting the project.
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
                    <input type="text" placeholder="Project Name" name="projectName" {...register("projectName")} className={styles.projectName}/>
                    <hr className={styles.line}/>
                    <h1 className={styles.descriptiontitle}>Description: </h1>
                    <textarea placeholder="Description" name="description" {...register("description")} className={styles.description}/>
                    <div className={styles.buttons}>
                        <button onClick={onClick} className={styles.deletebutton}>Delete Project</button>
                        <button type="submit" className={styles.submitbutton}>Save Changes</button>                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProjectEdit;