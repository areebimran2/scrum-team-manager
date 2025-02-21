import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/login.module.css";


export function Login() {

    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    function onSubmit(data){    

        let user = {
            email : data.email,
            password : data.password 
        }

        let allowLogin = true;

        // let response = fetch("http://127.0.0.1:10001/login", {
        //     method: "POST",
        //     headers : {
        //         'Content-Type': 'application/json;charset=utf-8'
        //     },
        //     body: JSON.stringify(user)
        // });

        // response.then(Response => {

        //     if (Response.status == 401){
        //         alert("Incorrect Password");
        //     } else if (Response.status == 404){
        //         alert("No User with that email");
        //     } else if (Response.status == 400){
        //         alert("Invalid Parameters")
        //     } else if (Response.status == 200){
        //         allowLogin = true;
        //         let date = new Date();
        //         date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
        //         let expires = "expires="+ date.toUTCString() + ";";
        //         Response.json().then(data => {
        //             user = data;
        //         });
        //         let uid = "jiraclonelogin=" + user.uid + ";";

        //         document.cookie = uid + expires + "path=/";
        //     } else {
        //         alert("Unknown error, please try again later");
        //     }

        // });

        if (allowLogin) {
            navigate("/dashboard", {replace: true});

            let date = new Date();
            date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
            let expires = "expires="+ date.toUTCString() + ";";
            let uid = "jiraclonelogin=" + user.email + ";";

            document.cookie = uid + expires + "path=/";

        }

    }

    const login = (

            <div className={styles.container}>
                <h1 className={styles.header}>Welcome Back!</h1>
                <p className={styles.prompt}>Please enter your login details:</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input type="text" placeholder="Email" name="email" required {...register("email")} />
                        <br/>
                        <input type="password" placeholder="Password" name="password" required {...register("password")}/>
                        <br/>
                        <a href="recoveryrequest" className={styles.recoveryLink}>Forgot your password? </a>
                        <br/>
                        <button type="submit">Login</button>
                        <p className={styles.signupPrompt}>Don't have an account? <a href="signup" className={styles.promptLink}>Sign up here!</a></p>
                    </div>
                </form>
            </div>

    );

  return (login);
}

export default Login;