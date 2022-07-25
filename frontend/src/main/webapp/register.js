let url = "http://localhost:8080/BackEndProjeto5/rest/users";
const registerButton = document.getElementById("register-button");
import refreshLanguage from "./changeLang.js"
const navBar = document.querySelector(".nav-container");
let infoUrl = new URLSearchParams();
let language 

let param = new URLSearchParams(window.location.search);
const lang = param.get("lang");
if(lang === null){
    language = "pt";
} else {
    language = lang;
}

navBar.addEventListener("click", function(evt){

    infoUrl.append("lang", document.querySelector("select").value);
    if(evt.target.id === "projects-button"){
        console.log("proj")
        window.location.href="feedProjects.html?" + infoUrl.toString();
    } 

    if(evt.target.id === "news-button"){
        console.log("news")
        window.location.href="index.html?" + infoUrl.toString();
    } 

    if(evt.target.id === "team-button"){
        window.location.href = "team.html?" + infoUrl.toString();
    } 
})

document.querySelector("select").value = language;

document.getElementById("info-login").addEventListener("click", function(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href="login.html?" + infoUrl.toString();
})

registerButton.addEventListener("click", register);

function register(){
console.log("oiiiiii")

    const fetchBody = JSON.stringify({
        firstName:document.getElementById("firstName-input").value,
        lastName:document.getElementById("lastName-input").value,
        username:document.getElementById("username-input").value,
        password:document.getElementById("password-input").value,
        email:document.getElementById("email-input").value,
        profilePic:document.getElementById("image-input").value,
        biography:document.getElementById("biography-input").value
    });

    console.log(fetchBody)

    const fetchRegisterUser = {
        method:"POST",
        headers: { "Content-Type": "application/json"},
        body: fetchBody,
    }

    fetch(url + "/register", fetchRegisterUser)
    .then((response) =>{
        if(response.status === 200){

            //limpar erro
            infoUrl.append("lang", document.querySelector("select").value);
            window.location.href="login.html?" + infoUrl.toString();
            
        } else if(response.status === 401){
            //erro
            document.querySelector(".error").innerText = "Ocorreu um erro a registar!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorRegister")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        } else {
            //erro
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        }
    })
}