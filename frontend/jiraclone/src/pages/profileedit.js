import { React, useState} from "react";
import ReactDOM from "react-dom/client";
import { redirect, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import getAuthCookie from "../components/getAuthCookie";
import styles from "../styles/profileedit.module.css";
import defaultPic from "../assets/defaultProfilePic.png";
import { Topbar } from "../components/topbar";

export function ProfileEdit() {

    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    const [user, setUser] = useState({ display_name: "", email: ""});
    
    let payload = getAuthCookie();

    //let userID = payload.uid;
    let userID = 1;

    console.log(payload);

    useEffect(() => {

        const controller = new AbortController();
        const signal = controller.signal;   

        fetch("http://127.0.0.1:10001/userprofile", {method: 'GET', credentials: 'include'})
        .then(response => {console.log(response.status); return response.json()})
        .then(data => {
            console.log("Inside function:");
            setUser(data);
        })
        .catch(error => {
            console.error("Error: ", error);
        });

        return () => controller.abort();

    }, []);

    // Ok idk how to do this but make a fetch request to the backend to get the user's information
    // If this is their first time logging in, then the user object will be empty
    // so do with that what you will

    // add more to the user object according to the things needed for the profile


    function onSubmit(data){

        console.log(data);
        if (data.password !== data.password2){
            alert("Passwords do not match");
            
        } else if (data.password === ""){
            alert("Password cannot be empty");

        } else if (data.password === user.password){
            alert("Cannot reuse old password");

        } else if (data.currPassword !== user.password){
            alert("Incorrect password");

        }

        let newUser = {
            uid : user.uid,
        };

        if (data.name !== ""){
            newUser.display_name = data.name;
        }

        if (data.email !== ""){
            newUser.email = data.email;
        }

        if (data.password !== ""){
            newUser.password = data.password;
        }

        let respone = fetch("http://127.0.0.1:10001/userprofile", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newUser)
        });

        navigate("/profile", {replace: true});


    };

    const profileEdit = (

            <div>
                <Topbar page_name="Edit Profile"/>
                <div className={styles.container}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.editableFields}>
                        <h1 className={styles.formnames}>Display Name: </h1>
                        <input type="text" placeholder="Name" name="name" {...register("name")} defaultValue={user.display_name} className={styles.input}/>

                        <h1 className={styles.formnames}>Email: </h1>
                        <input type="email" placeholder="Email" name="email" {...register("email")} defaultValue={user.email} className={styles.input}/>

                        <h1 className={styles.formnames}>Profile Picture</h1>
                        <input type="file" name="profilePic" {...register("profilePic")} className={styles.picinput}/>                        

                        <div className={styles.passwordSection}>
                            <h2 className={styles.resetPrompt}>Reset Password</h2>  
                            <hr/>
                        </div>
                        <h1 className={styles.formnames}>Password: </h1>
                        <input type="password" placeholder="Current Password" name="currPassword" {...register("currPassword")} className={styles.input}/>
                        <h1 className={styles.formnames}>New Password: </h1>
                        <input type="password" placeholder="New Password" name="password" {...register("password")} className={styles.input}/>
                        <h1 className={styles.formnames}>Confirm Password: </h1>
                        <input type="password" placeholder="Confirm Password" name="password2" {...register("password2")} className={styles.input}/>
                    </form>

                    <div className={styles.pfpAndButtons}>
                        <img src={defaultPic} alt="Profile Picture" className={styles.profilePicture}/>
                        <button type="submit" form="profileEdit" className={styles.submitButton}>Submit</button>
                        <button type="button" onClick={() => {navigate("/dashboard")}} className={styles.cancelButton}>Cancel</button>
                    </div>
                </div>
            </div>

    );

    return profileEdit;

}

export default ProfileEdit;