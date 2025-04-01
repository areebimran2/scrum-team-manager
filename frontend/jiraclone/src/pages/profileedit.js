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

    useEffect(() => {

        const controller = new AbortController();
        const signal = controller.signal;   

        fetch("http://127.0.0.1:10001/userprofile/", {method: 'GET', credentials: 'include'})
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

    function onSubmit(data){

        console.log(data);
        const isPasswordSectionTouched = 
        data.currPassword !== "" || 
        data.password !== "" || 
        data.password2 !== "";

        // Client-side validations
        if (isPasswordSectionTouched) {
            if (data.password !== data.password2) {
                alert("Passwords do not match");
                return;
            }
            if (data.password === "") {
                alert("New password cannot be empty");
                return;
            }
        }

        // Check if all fields are empty
        const isAllEmpty = 
            data.name === "" && 
            data.email === "" && 
            data.password === "";

        if (isAllEmpty) {
            alert("No changes to submit");
            return;
        }

        // Password validation promise chain
        const passwordValidation = isPasswordSectionTouched 
            ? fetch("http://127.0.0.1:10001/userprofile/check-password/", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ password: data.currPassword })
            }).then(response => {
                if (response.status === 200) return true;
                if (response.status === 401) {
                    alert("Incorrect current password");
                    throw new Error("Abort");
                }
                throw new Error("Password check failed");
            })
            : Promise.resolve(true);

        // Main processing chain
        passwordValidation
            .then(() => {
                // Build update payload
                const newUser = { uid: user.uid };
                if (data.name !== "") newUser.display_name = data.name;
                if (data.email !== "") newUser.email = data.email;
                if (data.password !== "") newUser.password = data.password;

                return fetch("http://127.0.0.1:10001/userprofile/", {
                    method: "POST",
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    body: JSON.stringify(newUser)
                });
            })
            .then(response => {
                if (!response.ok) throw new Error("Update failed");
                navigate("/profile");
            })
            .catch(error => {
                if (error.message !== "Abort") {
                    console.error("Error:", error);
                    alert("Operation failed: " + error.message);
                }
            });

        return;
    };

    const profileEdit = (

            <div>
                <Topbar page_name="Edit Profile"/>
                <div className={styles.container}>
                    <form id="profileEdit" onSubmit={handleSubmit(onSubmit)} className={styles.editableFields}>
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