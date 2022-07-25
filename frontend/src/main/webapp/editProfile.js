//const token = sessionStorage.getItem("token");
let url = "http://localhost:8080/BackEndProjeto5/rest/users";
import refreshLanguage from "./changeLang.js"
let language;
let infoUrl = new URLSearchParams();

let param = new URLSearchParams(window.location.search);
const token = param.get("tkn");
const lang = param.get("lang");
console.log(lang)
if(lang === null){
    language = "pt";
} else {
    language = lang;
}

document.querySelector("select").value = language;

document.addEventListener("DOMContentLoaded", loadUserInfo);
document.getElementById("profile-button").addEventListener("click", saveAlterations);

function loadUserInfo(){

    const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", token:token },
    };

    fetch(url, fetchOptions)
    .then((response) =>{
        if(response.status === 200){
            //limpar erro
            return response.json();
        } else if(response.status === 401){
            //caixas erro
            document.querySelector(".error").innerText = "Ocorreu um erro a carregar o seu perfil!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorLoadProfile")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
            
        } else if(response.status === 403){
            infoUrl.append("lang", document.querySelector("select").value);
            infoUrl.append("err", "4");
            window.location.href = "login.html?" + infoUrl.toString();
            //caixas erro
        } else {
            //caixas erro
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
    .then((data) =>{
        console.log(data)
        document.getElementById("profile-firstName-input").value = data.firstName;
        document.getElementById("profile-lastName-input").value = data.lastName;
        document.getElementById("profile-email-input").value = data.email;
        document.getElementById("profile-username-input").value = data.username;
        document.getElementById("profile-image-input").value = data.profilePic;
        document.getElementById("profile-password-input").value = data.password;
        document.getElementById("biography-input").value = data.biography;
    })

    refreshLanguage(document.querySelector("select").value);
}

function saveAlterations(){
    console.log("salvar")

    const fetchBody = JSON.stringify({
        firstName:document.getElementById("profile-firstName-input").value,
        lastName:document.getElementById("profile-lastName-input").value,
        username:document.getElementById("profile-username-input").value,
        password:document.getElementById("profile-password-input").value,
        email:document.getElementById("profile-email-input").value,
        profilePic:document.getElementById("profile-image-input").value,
        biography:document.getElementById("biography-input").value
    });

    const fetchEditProfile = {
        method:"POST",
        headers: { "Content-Type": "application/json", "token": token },
        body: fetchBody,
    }
    console.log(fetchEditProfile)

    fetch(url + "/editProfile", fetchEditProfile)
    .then((response) =>{
        if(response.status === 200){
            //limpar caixas de erro
            //let infoUrl = new URLSearchParams();
            infoUrl.append("lang", document.querySelector("select").value);

            if(token !== null || token !== ""){
                infoUrl.append("tkn", token);
            }

            window.location.href = "index.html?" + infoUrl.toString();
        } else if(response.status === 401){
            //erro
            document.querySelector(".error").innerText = "Ocorreu um erro a guardar as alterações!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorSaving")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        } else if(response.status === 403){
            //erro
            infoUrl.append("lang", document.querySelector("select").value);
            infoUrl.append("err", "4");
            window.location.href = "login.html?" + infoUrl.toString();
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