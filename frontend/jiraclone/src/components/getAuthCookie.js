export function getAuthCookie(){
    let cookies = document.cookie.split(";");
    let cookie = cookies.find(cookie => cookie.trim().startsWith("cookie_1"));

    if (!cookie){
        return null;
    }

    let content = cookie.replaceAll("cookie_1=", "").split(".");
    return atob(content[1]);
}

export default getAuthCookie;