import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import { useForm } from "react-hook-form";
import styles from "../styles/users.module.css";
import arrow from "../assets/arrow.png";
import x from "../assets/X.png";

export function UserView({ inputProject }) {
    const {register, handleSubmit} = useForm();
    const navigate = useNavigate();
    
    const [admins, setAdmins] = useState([{uid: 4, display_name: "User Admin"}, {uid: 5, display_name: "User Admin 2"}]);
    const [users, setUsers] = useState([{uid: 1, display_name: "User 1"}, {uid: 2, display_name: "User 2"}, {uid: 3, display_name: "User Long Display Name"}]);
    const [project, setProject] = useState(inputProject);
    const [httpCode, setHttpCode] = useState();


    // useEffect(() => {
    //     let counter;
    //     let uid;
    //     for (counter = 0; counter < project.admin.length; counter++){
    //         uid = project.admin[counter];
    //         fetch(`http://127.0.0.1:10001/user/${uid}`, {method: "GET"})
    //         .then(response => {
    //             if (response.status === 401){
    //                 throw new Error("Unauthorized request");
    //             } else if (response.status !== 200){
    //                 throw new Error(`API error: ${response.status}`);
    //             } else {
    //                 return response.json;
    //             }
    //         })
    //         .then(data => {
    //             setAdmins(
    //                 ...admins,
    //                 data
    //             )
    //         }).catch(e => {
    //             if (e.message === "Unauthorized request"){
    //                 navigate("/login");
    //             } else {
    //                 navigate("/dashboard");
    //             }
    //         });
    //     }
    //     for (counter = 0; counter < project.scrum_user.length; counter++){
    //         uid = project.scrum_user[counter];
    //         fetch(`http://127.0.0.1:10001/user/${uid}`, {method: "GET"})
    //         .then(response => {
    //             if (response.status === 401){
    //                 throw new Error("Unauthorized request");
    //             } else if (response.status !== 200){
    //                 throw new Error(`API error: ${response.status}`);
    //             } else {
    //                 return response.json;
    //             }
    //         })
    //         .then(data => {
    //             setUsers(
    //                 ...admins,
    //                 data
    //             )
    //         }).catch(e => {
    //             if (e.message === "Unauthorized request"){
    //                 navigate("/login");
    //             } else {
    //                 navigate("/dashboard");
    //             }
    //         });
    //     }
    // }, [])

    function onSubmit(data) {
        // add user submit thing 
        // check if valid email, if so, send them an email. 
        // if not, let the admin know in some way ig 
    }

    function onPromote(uid) {
        return function () {

            fetch(`http://127.0.0.1:10001/project/update/promote/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pid:project.pid,
                    uid: uid
                })
                })
            .then(response => {
                setHttpCode(response.status);
            });

            if (httpCode !== 200){
                alert("Server Error, please try again");
                return;
            }

            let user = users.find(user => user.uid === uid);
    
            // Update project state
            setProject(project => ({
                ...project,
                admin: [...project.admin, user],
                scrum_user: project.scrum_user.filter(user => user.uid !== uid)
            }));

            // Move user to admins
            setAdmins(admins => [...admins, user]);
            setUsers(users => users.filter(user => user.uid !== uid));

        };
    }
    
    function onDemote(uid) {
        return function () {

            fetch(`http://127.0.0.1:10001/project/update/demote/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pid:project.pid,
                    uid: uid
                })
                })
            .then(response => {
                setHttpCode(response.status);
            });

            if (httpCode !== 200){
                alert("Server Error, please try again");
                return;
            }

            let admin = admins.find(admin => admin.uid === uid);
    
            // Update project state
            setProject(project => ({
                ...project,
                scrum_user: [...project.scrum_user, admin],
                admin: project.admin.filter(admin => admin.uid !== uid)
            }));

            // Move admin back to users
            setUsers(users => [...users, admin]);
            setAdmins(admins => admins.filter(admin => admin.uid !== uid));
    
        };
    }
    
    function onDelete(uid) {
        return function () {

            fetch(`http://127.0.0.1:10001/project/update/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pid:project.pid,
                    uid: uid
                })
                })
            .then(response => {
                setHttpCode(response.status);
            });

            if (httpCode !== 200){
                alert("Server Error, please try again");
                return;
            }

            // Remove user from users and admins
            setUsers(users => users.filter(user => user.uid !== uid));
            setAdmins(admins => admins.filter(admin => admin.uid !== uid));
    
            // Update project state to remove the user from both admin and scrum_user lists
            setProject(project => ({
                ...project,
                admin: project.admin.filter(admin => admin.uid !== uid),
                scrum_user: project.scrum_user.filter(user => user.uid !== uid)
            }));
        };
    }

    // you'll probably need to change all of this anyways but I figure I'd at least provide a shell
    const UserCard = ({ user, project }) => {
        let uid = user.uid;
        if (admins.includes(user)) {
            return (
                <div className={styles.userCard}>
                    <p className={styles.username}>{user.display_name}</p>
                    <div className={styles.buttons}>
                        <button onClick={onDemote(uid)} className={styles.button}>
                            <img src={arrow} className={styles.demote}/>
                        </button>
                        <button onClick={onDelete(uid)} className={styles.button}>
                            <img src={x} className={styles.icon}/>
                        </button>
                    </div>
                </div>
            )
        } else {
            return ( 
            <div className={styles.userCard}>
                <p className={styles.username}>{user.display_name}</p>
                <div className={styles.buttons}>
                    <button onClick={onPromote(uid)} className={styles.button}>
                        <img src={arrow} className={styles.promote}/>
                    </button>
                    <button onClick={onDelete(uid)} className={styles.button}>
                        <img src={x} className={styles.icon}/>
                    </button>
                </div>
            </div>
            ) 
        }
    }

    return (
        <div className={styles.users}>
            <h3 className={styles.heading}>My Team</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Add User..." name="addUser" {...register("addUser")} className={styles.textbox}/>
                <button type="submit" className={styles.addButton}>Add User</button> 
            </form>

            <h3 className={styles.subheadings}>Admins</h3>
            <div>
                {admins.map(admin => (
                    <UserCard key={admin.uid} user={admin} project={project} />
                ))}
            </div>

            <h3 className={styles.subheadings}>Team Members</h3>
            <div>
                {users.map(user => (
                    <UserCard key={user.uid} user={user} project={project} />
                ))}
            </div>
        </div>
    )
}