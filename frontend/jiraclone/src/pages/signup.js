import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/signup.module.css";

export function Signup() {

    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    function onSubmit(data){

        if (data.password !== data.password2){
            document.getElementById("passwordError").style.display = "block";
            return;
        }

        let user = {
            email : data.email,
            password : data.password
        }
        
        let response = fetch("http://127.0.0.1:10001/signup/", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        response.then(Response => {
            
            if (Response.status === 409){
                alert("User already exists");
            } else if (Response.status === 400){
                alert("Invalid Parameters")
            } else if (Response.status === 200){
                navigate("/login", {replace: true});
            } else {
                alert("Unknown error, please try again later");
            }

        });

    }

    const signup = (

        <div className={styles.container}>
        <h1 className={styles.header}> Sign Up!</h1>
        <p className={styles.prompt}>Please enter your email and a password:</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input type="text" placeholder="Email" name="email" required {...register("email")}></input>
                    <br/>
                    <input type="password" placeholder="Password" name="password" required {...register("password")}></input>
                    <br/>
                    <input type="password" placeholder="Confirm Password" name="password" required {...register("password2")}></input>
                    <br/>
                    <button type="submit" className={styles.button}>Sign Up</button>
                    <br/>
                    <p className={styles.loginPrompt}>Already have an account? <a href="login" className={styles.loginLink}>Log in here!</a></p>
                </div>
            </form>
        </div>

    );

    return signup;

};

export default Signup;