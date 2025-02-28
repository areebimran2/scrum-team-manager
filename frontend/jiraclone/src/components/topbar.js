import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import styles from "../styles/topbar.module.css";
import logoutIcon from "../assets/logout.png";
import homeIcon from "../assets/home.png";

export function Topbar({ page_name }) {
    const navigate = useNavigate();

    function onHomeClick() {
        navigate("/dashboard", {replace: true});
    }

    function onLogoutClick() {
        // I think you'll need to add to this for clearing tokens and all the necessary actions that come with logging out
        navigate("/login", {replace: true});
    }

    return (
        <div className={styles.topbar}>
            <h1 className={styles.pageName}>{page_name}</h1>

            <div className={styles.buttons}>
                <button onClick={onHomeClick} className={styles.button}>
                    <img src={homeIcon} className={styles.icon} />
                </button>
                <button onClick={onLogoutClick} className={styles.button}>
                    <img src={logoutIcon} className={styles.icon} />
                </button>
            </div>
        </div>
    );
};