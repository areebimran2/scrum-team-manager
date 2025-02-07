import React from "react";
import ReactDOM from "react-dom/client";
import { Form, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/profileedit.module.css";

export function ProfileEdit() {
    
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();

    // Ok idk how to do this but make a fetch request to the backend to get the user's information
    // If this is their first time logging in, then the user object will be empty
    // so do with that what you will

    // add more to the user object according to the things needed for the profile

    let user = {
        firstName: "",
        lastName: ""
    }

    function onSubmit(data){    

    }

    const profileEdit = (
        <body className={styles.body}>
            <div>
                <h1>Welcome</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className={styles.formnames}>First name: </p>
                    <input type="text" placeholder="First Name" name="firstName" required {...register("firstName")} value={user.firstName}/>
                    <input type="text" placeholder="Last Name" name="lastName" required {...register("lastName")} value={user.lastName}/>
                    <br/>

                </form>
            </div>
        </body>
    );
    return profileEdit;
}

export default ProfileEdit;