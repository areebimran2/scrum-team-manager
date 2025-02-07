import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/recoveryrequest.module.css";

export function RecoveryRequest() {

    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    
    function onSubmit(data){    

        let user = {
            email : data.email
        }

        let response = fetch("http://127.0.0.1:10001/login/recover/", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        response.then(Response => {
            
            if (Response.status === 404){
                alert("No User with that email");
            } else if (Response.status === 400){
                alert("Invalid Parameters")
            } else if (Response.status === 200){
                navigate("/recoveryrequestsuccess", {replace: true});
            } else {
                alert("Unknown error, please try again later");
            }

        });

    }

    const recoveryRequest = (
        <div id="recoveryRequest" className={styles.outsideContainer}>
            <div className={styles.container}>
                <h1 className={styles.heading}> Password Recovery </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="container">
                        <input type="text" placeholder="Email" name="email" required {...register("email")} />
                        <br/>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
    
    return recoveryRequest;
}

export default RecoveryRequest;