import React from "react";
import { useState } from "react";

export function AutoAssignButton({ description, pid, tid }) {
    const autoAssign = async () => {


        const url = "http://127.0.0.1:10001/"
        const response = await fetch(url + "agg/" + pid, {
            method: "GET"
        });



        const responseData = await response.json();

        if (!response.ok) {
            alert("Error occured while aggregating ticket statistics")
            return;
        }

        const AIresponse = await fetch(url + "llm", {
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

        const best_user_and_desc = (await AIresponse.json()).get("best_user_and_desc");

        const best_user = best_user_and_desc.split(",")[0]

        const AssignResponse = await fetch(url + `project/${pid}/assign/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tid: tid,
                assigned: parseInt(best_user)
            })
        }
        )

        if (AssignResponse.status == 401) {
            alert("You are not an admin!")
        }

        if (!AssignResponse.ok) {
            alert("Error Occured while auto assigining. please try again or manually assign");
            return;
        }

        alert(`User with ID ${best_user} was assigned for this reason: \n ${best_user_and_desc.split(",").slice(1).join(",")}`)




    }

    return (
        <button
            onClick={autoAssign}
            style={{ backgroundColor: "blue", color: "white", borderRadius: "10px", padding: "10px 20px", border: "none" }}
        >
            Auto Assign
        </button>

    )
}