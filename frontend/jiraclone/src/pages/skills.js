"use client"
import styles from '../styles/skills.module.css';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';


export function Skills() {
    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const {register, handleSubmit} = useForm();

    let uid = document.cookie.split("=")[1];

    let response = fetch("http://127.0.0.1:10001/userprofile/" + uid, {
        method: "GET"
    });

    //Sets up the user object to be the incoming data from the user GET request
    response.then(Response => {
        if (Response.status === 200){
            Response.json().then(data => {
                setUser(data);
                setSkills(data.skills || []);
            });
        } else {
            alert("Unknown error, please try again later");
        }
    });

    // before you ask, yes copilot wrote this i was trying to speedrun this and it wasn't going well 
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (newSkill.trim() != "") {
                setSkills([...skills, newSkill.trim()]);
                setNewSkill("");
            }
        }
    }

    const SkillBubble = ({ skill }) => {
        const handleClick = () => {
            setSkills(prevSkills => prevSkills.filter(s => s != skill))
        }
        return (
            <button type="button" onClick={handleClick} className={styles.skillbutton}>
                {skill}
            </button>
        );
    };

    const SkillList = ({skills}) => {
        return (
            <div className={styles.skilllist}>
                {skills.map((skill, index) => (
                    <SkillBubble key={index} skill={skill} />
                ))}
            </div>
        );
    }

    function onSubmit(data){

        //Insert code here to handle form submission
        let newUser={
            uid : user.uid,
            skills: skills,
        };


        //Makes post request with the newUser object as the body
        let response = fetch("http://127.0.0.1:/10001/userprofile", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newUser)
        });

    }

    return (
        <div id="skills">
            <h1> Skills </h1>
            <form>
                <input 
                        type="text" 
                        placeholder="Skills" 
                        name="skills" 
                        value={newSkill}
                        // I think these parts need to be changed, I'm just too big stupid rn 
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required={false}
                        {...register("skills")}/>
                <br/>
                <SkillList skills={skills} />
            </form>
            <form onSubmit={handleSubmit(onSubmit)}>               
                    <button type="submit">Submit</button>
            </form>
        </div>
    )


}

export default Skills;

