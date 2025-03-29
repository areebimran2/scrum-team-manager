import { React, useState} from "react";
import ReactDOM from "react-dom/client";
import { redirect, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import getAuthCookie from "../components/getAuthCookie";
import styles from "../styles/profileedit.module.css";
import defaultPic from "../assets/defaultProfilePic.png";

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

            <div className={styles.background}>
                <div className={styles.container}>
                    
                    <img src={defaultPic} alt="Profile Picture" className={styles.profilePicture}/>
                    <h1>Edit Profile</h1>                    

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <p className={styles.formnames}>Name: </p>
                            <input type="text" placeholder="Name" name="name" {...register("name")} value={user.display_name} className={styles.input}/>
                            <p className={styles.formnames}>Email: </p>
                            <input type="text" placeholder="Email" name="email" {...register("email")} value={user.email} className={styles.input}/>
                            <div className={styles.passwords}>
                                <p className={styles.formnames}>Password: </p>
                                <input type="password" placeholder="Current Password" required name="currPassword" {...register("currPassword")} className={styles.input}/>
                                <input type="password" placeholder="Password" name="password" {...register("password")} className={styles.input}/>
                                <input type="password" placeholder="Confirm Password" name="password" {...register("password2")} className={styles.input}/>
                            </div>
                            <p className={styles.formnames}>Profile Picture</p>
                            <input type="file" name="profilePic" {...register("profilePic")} className={styles.picinput}/>
                            <br/>
                            <div className={styles.buttons}>
                                <button type="submit">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

    );

    return profileEdit;

}

export default ProfileEdit;