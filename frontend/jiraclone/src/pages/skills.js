import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { useForm, handleSubmit } from "react-hook-form";
import SearchableDropdown from "../components/SearchableDropdown";
import { Topbar } from "../components/topbar";
import styles from "../styles/skills.module.css";

export function Skills() {
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

    // TODO: fill this with the user's current skills from the database 
    const dbskills = ["Optimization", "Python"];   // filler items to check functionality 

    // get all the possible skills and take out any that the user already has
    const [allSkills, setAllSkills] = useState(
        skill_list
            .filter((skill) => !dbskills.includes(skill))
            .sort((a, b) => (a > b ? 1 : -1))
    );

    const [skills, setSkills] = useState(dbskills);
    const [value, setValue] = useState("");
    
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
        return (
            <div key={skill} className={styles.skill}>
                <button onClick={() => onDelete(skill)} className={styles.delete}>{skill}</button>
            </div>
        );
    });

    function onConfirm() {
        // send the skills to the database
    } 

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