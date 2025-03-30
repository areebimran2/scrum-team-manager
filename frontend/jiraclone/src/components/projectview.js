import { React, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/projectview.module.css';

export function ProjectView({ input, uid }) {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => setProjects(input), [input]);

    function OnClick(uid) {
        return function () {
            fetch("http://127.0.0.1:10001/project/add/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: "Placeholder title",
                    creator: uid,
                    description: "Placeholder description"
                }),
                credentials: "include"
            })
                .then(response => response.json())
                .then(data => navigate(`/projectedit?pid=${data.pid}`))
        }
    }

    function OnProjectClick(isAdmin, pid) {
        return function () {
            if (isAdmin) {
                navigate(`/adminproject?pid=${pid}`);
            } else {
                navigate(`/project?pid=${pid}`);
            };
        }
    }

    const ProjectCard = ({ project, uid }) => {
        // maybe check to see if the project's admin has the same ID as the person whose projects are being loaded 
        // and if it is, say "role: admin"
        // if not, say "role: member" or whatever other word works.
        let pid = project.pid
        let isAdmin = project.admin.includes(uid);
        return (
            <button onClick={OnProjectClick(isAdmin, pid)} className={styles.projectCard}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <h4>{project.description}</h4>
                {isAdmin ? <h4>Role: Admin</h4> : <h4>Role: Developer</h4>}
            </button>
        );
    };

    return (
        <div className={styles.projectList}>
            <button onClick={OnClick(uid)} className={styles.button}>
                <h2 className={styles.createnew}>Create New Project</h2>
                <h1 className={styles.plus}>+</h1>
            </button>
            {projects.map(project => (
                <ProjectCard key={project.pid} project={project} uid={uid} />
            ))}
        </div>
    );
}