


export function Skills() {

    let user;

    let uid = document.cookie.split("=")[1];

    let response = fetch("http://127.0.0.1:10001/userprofile/" + uid, {
        method: "GET"
    });

    //Sets up the user object to be the incoming data from the user GET request
    response.then(Response => {
        if (Response.status === 200){
            Response.json().then(data => {
                user = data;
            });
        } else {
            alert("Unknown error, please try again later");
        }
    });


    function onSubmit(data){

        //Insert code here to handle form submission
        let newUser={
            uid : user.uid,
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


}

export default Skills;

