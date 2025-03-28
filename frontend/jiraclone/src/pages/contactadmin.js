import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/contactadmin.module.css";
import SearchableDropdown from "../components/SearchableDropdown"
import { Topbar } from "../components/topbar";

export function ContactAdmin() {
    const {register, handleSubmit} = useForm();

    // idk how you're storing the tid i've just done this 
    const tid = 69;

    // fill this with the admins of the project
    const admins = [{email: "admin1@email.com", display_name: "Jim"}, 
                    {email: "admin2@email.com", display_name: "Not Jim"}];

    const [value, setValue] = useState("");

    function onSubmit(data) {
    // go crazy go stupid ig 
    }

    return (
        <div>
            <Topbar page_name="Contact Admin" />
            <div className={styles.page}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <input 
                        type="text" 
                        placeholder="Ticket Name" 
                        name="ticketName" 
                        value={`Issue: Ticket ${tid}`} 
                        {...register("ticketName")} 
                        className={styles.ticketName}
                    />
                    <h2 className={styles.subtitles}>Admin: </h2>  
                    <SearchableDropdown
                        options={admins}
                        label="email"
                        selectedVal={value}
                        handleChange={(val) => {
                            setValue(val);
                            register("admin", { value: val }); // Register the selected admin value
                        }}
                    />
                    <h2 className={styles.subtitles}>Reason for Report: </h2>
                    <textarea 
                        placeholder="Description of issue: (e.g. incorrect ticket assignment, too many tickets assigned, etc.)" 
                        name="description" 
                        {...register("description")} 
                        className={styles.description}
                    />
                    <button type="submit" className={styles.submitbutton}>Send Email</button> 
                </form>
            </div>
        </div>
    )
}

export default ContactAdmin;