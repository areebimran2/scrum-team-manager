import React from 'react';
import ReactDOM from 'react-dom/client';
import { useForm } from "react-hook-form";
import styles from "../styles/users.module.css";
import arrow from "../assets/arrow.png";
import x from "../assets/X.png";

export function UserView({ project }) {
    const {register, handleSubmit} = useForm();

    /**
     * For testing purposes
     * doesn't work. welp. 
     */
    const admins = [
        {
            uid: 4, 
            display_name: "User Admin"
        },
        {
            uid: 5,
            display_name: "User Admin 2"
        }
    ];

    const users = [
        {
            uid: 1,
            display_name: "User 1"
        },
        {
            uid: 2,
            display_name: "User 2"
        },
        {
            uid: 3,
            display_name: "User Long Display Name"
        }
    ];

    // this part worked tho 
    const user = {uid: 8, display_name:"AAAAAAA"};

    function onSubmit(data) {
        // add user submit thing 
        // check if valid email, if so, send them an email. 
        // if not, let the admin know in some way ig 
    }

    function onPromote() {
        // do the promote things 
    }

    function onDemote() {
        // do the demote things 
    }
    function onDelete() {
        // banish the user to the shadow realm
    }

    // you'll probably need to change all of this anyways but I figure I'd at least provide a shell
    const UserCard = ({ user }) => {
        if (project.admins.includes(user.uid)) {
            return (
                <div className={styles.userCard}>
                    <p className={styles.username}>{user.display_name}</p>
                    <div className={styles.buttons}>
                        <button onClick={onDemote} className={styles.button}>
                            <img src={arrow} className={styles.demote}/>
                        </button>
                        <button onClick={onDelete} className={styles.button}>
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
                    <button onClick={onPromote} className={styles.button}>
                        <img src={arrow} className={styles.icon}/>
                    </button>
                    <button onClick={onDelete} className={styles.button}>
                        <img src={x} className={styles.icon}/>
                    </button>
                </div>
            </div>
            ) 
        }
    }

    // you're definitely going to have to change this. It doesn't work I don' think. 
    const UserList = ({ users }) => {
        return (
            <div>
                {users.map(user => {
                    <UserCard key={user.uid} user={user}/>
                })}
            </div>
        )
    }

    return (
        <div className={styles.users}>
            <h3 className={styles.heading}>My Team</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Add User..." name="addUser" {...register("addUser")} className={styles.textbox}/>
                <button type="submit" className={styles.addButton}>Add User</button> 
            </form>

            <h3 className={styles.subheadings}>Admins</h3>
            <UserList users={admins}/>

            <h3 className={styles.subheadings}>Team Members</h3>
            <UserList users={users}/>
            <UserCard user={user}/>
        </div>
    )
}