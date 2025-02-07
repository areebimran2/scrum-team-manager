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

        // do what you gotta do over here to process if the email exists 
        // for now I just have it go to the recover request success page without checking anything 
        // or sending the request at all

        navigate("/recoveryrequestsuccess", {replace: true});
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