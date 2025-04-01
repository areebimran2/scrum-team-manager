import React from "react";
import { useState } from "react";

export function AutoAssignButton({ description, pid, tid, setAssigned, setAuto }) {
    const autoAssign = async () => {



        const response = await fetch("http://127.0.0.1:10001/agg/" + pid, {
            method: "GET",
            credentials: "include"
        });



        const responseData = await response.json();

        if (!response.ok) {
            alert("Error occured while aggregating ticket statistics")
            return;
        }

        console.log(description);
        const AIresponse = await fetch("http://127.0.0.1:10001/llm/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description: description,
                users: responseData
            })
        });

        if (!AIresponse.ok) {
            alert("Error Occured while generating response")
            return;
        }

        const best_user_and_desc = (await AIresponse.json()).best_user_and_desc;

        console.log(best_user_and_desc);
        const best_user = best_user_and_desc.split(",")[0]

        const userResponse = await fetch(`http://127.0.0.1:10001/userprofile/${best_user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const username = (await userResponse.json()).display_name;
        setAssigned(username);
        setAuto(parseInt(best_user));
        console.log(username);


        alert(`User with ID ${best_user} was assigned for this reason: \n ${best_user_and_desc.split(",").slice(1).join(",")}`)




    }

    return (
        <button
            onClick={autoAssign}
            style={{ backgroundColor: "blue", color: "white", borderRadius: "10px", padding: "10px 20px", border: "none", position: "relative", left: "650px", bottom: "30px" }}
        >
            Auto Assign
        </button>

    )
}