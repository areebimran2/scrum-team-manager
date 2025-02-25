import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/projectview.module.css';

export function ProjectView({ projects }) {
    const navigate = useNavigate();

    function OnClick() {
        navigate("projectedit", {replace: true});
    }

    function OnProjectClick() {
        // Have this navigate to the specific project page depending on the name of the project I guess?
        // you might have to create a second function like this one for admin specific project clicking.
        navigate("project", {replace: true});
    }

    const ProjectCard = ({ project }) => {
        // maybe check to see if the project's admin has the same ID as the person whose projects are being loaded 
        // and if it is, say "role: admin"
        // if not, say "role: member" or whatever other word works.
        return (
            <button onClick={OnProjectClick} className={styles.projectCard}>
                <h3 className={styles.projectName}>{project.name}</h3>
            </button>
        );
    };

    const ProjectList = ({ projects }) => {
        return (
            <div className={styles.projectList}>
                <button onClick={OnClick} className={styles.button}>
                    <h2 className={styles.createnew}>Create New Project</h2>
                    <h1 className={styles.plus}>+</h1>
                </button>
                {projects.map(project => (
                    <ProjectCard key={project.pid} project={project} />
                ))}
            </div>
        )
    }

    return <ProjectList projects={projects} />;
}