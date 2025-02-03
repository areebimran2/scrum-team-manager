import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


export function Login() {

    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    function onSubmit(data){
        
        let username = data.username
        let password = data.password

        if (username === "admin" && password === "password"){
            navigate("/dashboard", {replace: true});
        } else {
            alert("Invalid credentials");
        } 

    }

    const login = (

            <div id="login">
                <h1> Login </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="container">
                        <input type="text" placeholder="Username" name="username" required {...register("username")} />
                        <br/>
                        <input type="password" placeholder="Password" name="password" required {...register("password")}/>
                        <br/>
                        <a href="">Forgot Password?</a>
                        <br/>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>

    );

    function handleLoginSubmit(){

        let username = document.getElementsByName("username").value;
        let password = document.getElementsByName("password").value;

        alert("Username: " + username + " Password: " + password);

        if(username === "admin" && password === "password"){
            navigate("/dashboard", {replace: true});
        } else {
            alert("Invalid credentials");
        }

    }

  return (login);
}

export default Login;