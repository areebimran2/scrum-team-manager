import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import { useForm } from "react-hook-form";
import styles from "../styles/users.module.css";
import arrow from "../assets/arrow.png";
import x from "../assets/X.png";

export function UserView({ pid }) {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [adminUIDs, setAdminUIDs] = useState([]);
    const [userUIDs, setUserUIDs] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const [project, setProject] = useState({});
    const [httpCode, setHttpCode] = useState(0);

    useEffect(() => {

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
                setAdminUIDs(data[0].admin);
                setUserUIDs(data[0].scrum_users);
                setProject(data[0]);
            }).catch(e => {
                if (e.message === "Unauthorized request") {
                    navigate("/login");
                } else {
                    navigate("/dashboard");
                }
            });

        fetch(`http://127.0.0.1:10001/project/${pid}/members/`, { method: "GET", credentials: "include", })
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
                setMembers(data.members);
            }).catch(e => {
                if (e.message === "Unauthorized request") {
                    navigate("/login");
                } else {
                    navigate("/dashboard");
                }
            });

    }, [])

    useEffect(() => {
        setAdmins(members.filter(member => { return adminUIDs.includes(member.uid) }));
        setUsers(members.filter(member => { return (userUIDs.includes(member.uid) && !adminUIDs.includes(member.uid)) }));
        // console.log(adminUIDs);
        // console.log(userUIDs);
    }, [members])

    function onSubmit(data) {
        // add user submit thing 
        // check if valid email, if so, send them an email. 
        // if not, let the admin know in some way ig 
    }

    function onPromote(uid) {
        return function () {

            if (users.length === 1) {
                alert("Cannot promote last developer");
            } else {
                fetch(`http://127.0.0.1:10001/project/update/promote/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pid: project.pid,
                        uid: uid
                    })
                })
                    .then(response => {
                        setHttpCode(response.status);
                    });

                if (httpCode !== 200) {
                    alert("Server Error, please try again");
                    return;
                } else {

                    let user = users.find(user => user.uid === uid);

                    // Update project state
                    setProject(project => ({
                        ...project,
                        admin: [...project.admin, user],
                        scrum_user: project.scrum_users.filter(user => user.uid !== uid)
                    }));

                    // Move user to admins
                    setAdmins([...admins, user]);
                    setUsers(users.filter(user => user.uid !== uid));
                }
            }
        };
    }

    function onDemote(uid) {
        return function () {

            if (admins.length === 1) {
                alert("Cannot demote last admin");
            } else {
                fetch(`http://127.0.0.1:10001/project/update/demote/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pid: project.pid,
                        uid: uid
                    })
                })
                    .then(response => {
                        setHttpCode(response.status);
                    });

                if (httpCode !== 200) {
                    alert("Server Error, please try again");
                    return;
                } else {

                    let admin = admins.find(admin => admin.uid === uid);

                    // Update project state
                    setProject(project => ({
                        ...project,
                        scrum_users: [...project.scrum_users, admin],
                        admin: project.admin.filter(admin => admin.uid !== uid)
                    }));

                    // Move admin back to users
                    setUsers(users => [...users, admin]);
                    setAdmins(admins => admins.filter(admin => admin.uid !== uid));
                }
            }
        };
    }

    function onDelete(uid) {
        return function () {

            if (admins.length === 1 && (typeof (admins.find(admin => admin.uid === uid)) !== "undefined")) {
                alert("Cannot remove last admin");
            } else if (users.length === 1 && (typeof (users.find(user => user.uid === uid)) !== "undefined")) {
                alert("Cannot remove last developer");
            } else {

                fetch(`http://127.0.0.1:10001/project/update/remove/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pid: project.pid,
                        uid: uid
                    })
                })
                    .then(response => {
                        setHttpCode(response.status);
                    });

                if (httpCode !== 200) {
                    alert("Server Error, please try again");
                    return;
                } else {

                    // Remove user from users and admins
                    setUsers(users => users.filter(user => user.uid !== uid));
                    setAdmins(admins => admins.filter(admin => admin.uid !== uid));

                    // Update project state to remove the user from both admin and scrum_user lists
                    setProject(project => ({
                        ...project,
                        admin: project.admin.filter(admin => admin.uid !== uid),
                        scrum_users: project.scrum_users.filter(user => user.uid !== uid)
                    }));
                }
            }
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
                            <img src={arrow} className={styles.demote} />
                        </button>
                        <button onClick={onDelete(uid)} className={styles.button}>
                            <img src={x} className={styles.icon} />
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
                            <img src={arrow} className={styles.promote} />
                        </button>
                        <button onClick={onDelete(uid)} className={styles.button}>
                            <img src={x} className={styles.icon} />
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
                <input type="text" placeholder="Add User..." name="addUser" {...register("addUser")} className={styles.textbox} />
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