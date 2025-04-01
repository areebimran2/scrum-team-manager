import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles/contactadmin.module.css";
import SearchableDropdown from "../components/SearchableDropdown"
import { Topbar } from "../components/topbar";

export function ContactAdmin() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    // idk how you're storing the tid i've just done this 
    const [searchParams, setSearchParams] = useSearchParams();
    const tid = searchParams.get("tid");

    // fill this with the admins of the project

    const [value, setValue] = useState("");
    const [ticket, setTicket] = useState({});
    const [project, setProject] = useState({});
    const [projectMembers, setProjectMembers] = useState([]);
    const [pid, setPid] = useState();
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:10001/ticket/${tid}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Unauthorized request");
        } else if (response.status !== 200) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setTicket(data);
      } catch (error) {
        if (error.message === "Unauthorized request") {
          navigate("/login");
        } else {
          setTicket({ title: "Server Error", description: "Server Error" });
          alert(`${error.message}. Please reload the page.`);
        }
      }
    };

    fetchTicket();
  }, []);

    useEffect(() => {
    const fetchProjectData = async () => {
      if (typeof ticket.project === "undefined") return;

      try {
        // Fetch project details
        const projectResponse = await fetch(`http://127.0.0.1:10001/project/${ticket.project}`, {
          method: "GET",
          credentials: "include",
        });

        if (projectResponse.status === 401) {
          throw new Error("Unauthorized request");
        } else if (projectResponse.status !== 200) {
          throw new Error(`API error: ${projectResponse.status}`);
        }

        const projectData = await projectResponse.json();
        if (projectData && projectData[0]) {
          setProject(projectData[0]);
          setPid(projectData[0].pid);
        }

        // Fetch project members
        const membersResponse = await fetch(`http://127.0.0.1:10001/project/${ticket.project}/members`, {
          method: "GET",
          credentials: "include",
        });

        if (membersResponse.status === 401) {
          throw new Error("Unauthorized request");
        } else if (membersResponse.status !== 200) {
          throw new Error(`API error: ${membersResponse.status}`);
        }

        const membersData = await membersResponse.json();
        if (membersData && Array.isArray(membersData.members)) {
          setProjectMembers(membersData.members);
        }
      } catch (error) {
        if (error.message === "Unauthorized request") {
          navigate("/login");
          alert("Unauthorized Request");
        } else {
          alert(`${error.message}. Please reload the page`);
        }
      }
    };

    fetchProjectData();
  }, [ticket]);

    useEffect(() => {
        if (typeof(projectMembers) !== "undefined" && typeof(project) !== "undefined"){
            setAdmins(projectMembers.filter(member => project.admin.includes(member.uid)));
        }
    }, [projectMembers])

    function onSubmit(data) {
        console.log(data)
        fetch(`http://127.0.0.1:10001/project/${pid}/contact/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                admin_email: data.admin,
                tid: tid,
                message: data.description
            }),
            credentials: "include"
        }).then(response => {
            if (response.status !== 200){
                alert("Server error, please try again");
            }
        });

    }

    return (
        <div>
            <Topbar page_name="Contact Admin" />
            <div className={styles.page}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <input
                        type="text"
                        placeholder={`Issue: Ticket ${tid}`}
                        name="ticketName"
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