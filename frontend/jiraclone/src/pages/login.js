import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles/login.css";


export function Login() {

    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    function onSubmit(data){    

        let user = {
            email : data.email,
            password : data.password 
        }

        let allowLogin = false;

        let response = fetch("http://127.0.0.1:10001/login/", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        response.then(Response => {

            if (Response.status == 401){
                alert("Incorrect Password");
            } else if (Response.status == 404){
                alert("No User with that email");
            } else if (Response.status == 400){
                alert("Invalid Parameters")
            } else if (Response.status == 200){
                allowLogin = true;
                navigate("/dashboard", {replace: true});
            } else {
                alert("Unknown error, please try again later");
            }

        });

        if (allowLogin) {
            navigate("/dashboard", {replace: true});
        }

    }

    const login = (

            <div id="login">
                <h1> Login </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="container">
                        <input type="text" placeholder="Email" name="email" required {...register("email")} />
                        <br/>
                        <input type="password" placeholder="Password" name="password" required {...register("password")}/>
                        <br/>
                        <a href="/recoveryrequest">Forgot Password?</a>
                        <br/>
                        <button type="submit">Login</button>
                        <a href="signup">Don't have an account? Sign up here</a>
                    </div>
                </form>
            </div>

    );

  return (login);
}

export default Login;