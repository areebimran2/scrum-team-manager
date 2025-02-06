import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles/signup.css";

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
        
        let response = fetch("http://127.0.0.1:10001/signup", {
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

        <div id="signup">
        <h1> Register</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="container">
                    <input type="text" placeholder="Email" name="email" required {...register("email")}></input>
                    <br/>
                    <input type="password" placeholder="Password" name="password" required {...register("password")}></input>
                    <br/>
                    <input type="password" placeholder="Confirm Password" name="password" required {...register("password2")}></input>
                    <br/>
                    <p id="passwordError">Passwords do not match</p>
                    <button type="submit">Register</button>
                    <br/>
                    <a href="login">Already have an account? Log in here</a>
                </div>
            </form>
        </div>

    );

    return signup;

};

export default Signup;