export function getAuthCookie(){
    let cookies = document.cookie.split(";");
    let cookie = cookies.find(cookie => cookie.trim().startsWith("JWTHeaderPayload"));

    if (!cookie){
        return null;
    }

    let content = cookie.slice(18).split(".");
    return atob(content[1]);
}

export default getAuthCookie;