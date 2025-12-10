import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, handleSubmit } from "react-hook-form";
import SearchableDropdown from "../components/SearchableDropdown";
import { Topbar } from "../components/topbar";
import styles from "../styles/skills.module.css";

export function Skills() {
    const navigate = useNavigate();
    var skill_list = [
        "SQL", "MongoDB", "MySQL", "PostgreSQL",
        "Django", "React", "REST API",
        "Back-end", "Front-end", "Full Stack",
        "Networking", "Debugging", "Testing", "System Architecture", "Cyber Security",
        "Python", "Java", "C", "C++", "C#", "Rust", "Javascript",
        "Pandas", "Numpy",
        "Html & CSS", "Bootstrap", "Tailwind",
        "Optimization",
    ];

    // get all the possible skills and take out any that the user already has
    const [allSkills, setAllSkills] = useState([]);

    const [skills, setSkills] = useState([]);
    const [value, setValue] = useState("");
    const [user, setUser] = useState({});

    useEffect(() => {
            //Load user profile
            fetch(`http://127.0.0.1:10001/userprofile/`, { method: "GET", credentials: "include", })
                .then(response => {
                    if (response.status === 401) {
                        throw new Error("Unauthorized request");
                    } else if (response.status !== 200) {
                        throw new Error(`API error: ${response.status}`);
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    setUser(data);
                    setSkills(data.skills);
                    setAllSkills(skill_list
                        .filter((skill) => !data.skills.includes(skill))
                        .sort((a, b) => (a > b ? 1 : -1)));
                }).catch(e => {
                    if (e.message === "Unauthorized request") {
                        navigate("/login");
                        alert("Unauthorized Request");
                    } else {
                        alert(`${e.message}. Please reload the page`);
                    }
                });

        }, [])

    
    function onSubmit(data) {
        setSkills((prevSkills) => [...prevSkills, data.skill]);
        // remove the skill from the allSkills list
        setAllSkills((prevAllSkills) =>
            prevAllSkills.filter((skill) => skill !== data.skill)
        );
    }
    
    function onDelete(data) {
        setSkills((prevSkills) => prevSkills.filter((skill) => skill !== data));
        // add the skill back to the allSkills list
        setAllSkills((prevAllSkills) => [...prevAllSkills, data]);
        // sort the allSkills list
        setAllSkills((prevAllSkills) =>
            prevAllSkills.sort((a, b) => (a > b ? 1 : -1))
        );
    }

    const currentSkills = skills.map((skill) => {
        console.log(skills)
        return (
            <div key={skill} className={styles.skill}>
                <button onClick={() => onDelete(skill)} className={styles.delete}>{skill}</button>
            </div>
        );
    });

    function onConfirm() {
        fetch("http://127.0.0.1:10001/userprofile/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
            credentials: "include"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to save skills (status: ${response.status})`);
            }
            return response;
        })
        .then(() => {
            navigate("/dashboard");
        })
        .catch(error => {
            console.error("Confirmation failed:", error);
            alert("Failed to save skills: " + error.message);
        });
    } 

    useEffect(() => {setUser({...user, skills:skills});}, [skills]);

    return (
        <div>
            <Topbar page_name={"Edit Skills"} />
            <div className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.currentSkills}> Your Skills </p>
                    <hr className={styles.horizontalLine} />
                    <div className={styles.skills}>
                        {currentSkills}
                    </div>
                    <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit({ skill: value });
                        setValue(""); // Clear the dropdown value after submission
                    }}>                            
                    <p className={styles.addSkill}>Click on a skill to remove it</p>
                        <div className={styles.form}>

                            <SearchableDropdown
                                options={allSkills.map((skill) => ({ name: skill }))}
                                label="name"
                                selectedVal={value}
                                handleChange={(val) => setValue(val)}
                                className={styles.dropdown}
                                inputClassName={styles.dropdownInput}
                                optionsClassName={styles.dropdownOptions}
                                arrowClassName={styles.dropdownArrow}
                            />
                            <button type="submit" className={styles.add}>Add +</button>
                        </div>
                    </form>
                    <button onClick={onConfirm} className={styles.confirm}>Confirm Changes</button>
                </div>
            </div>
        </div>
    )
}

export default Skills;