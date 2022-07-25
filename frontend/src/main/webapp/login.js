let url = "http://localhost:8080/BackEndProjeto5/rest/users";
const loginButton = document.getElementById("login-button");
import refreshLanguage from "./changeLang.js"
const navBar = document.querySelector(".nav-container");
let infoUrl = new URLSearchParams();
let language 

let param = new URLSearchParams(window.location.search);
const lang = param.get("lang");
const error = param.get("err");
if(lang === null){
    language = "pt";
} else {
    language = lang;
}

if(error === "4"){
    console.log("merda")
    document.querySelector(".error").innerText = "Ocorreu um erro! Volte a fazer o login!"
    document.querySelector(".error").style.background = "#874681";
    document.querySelector(".error").style.color = "white";
    document.querySelector(".error").setAttribute("data-i18n","error4")
    document.querySelector(".error").addEventListener("click", function(){
        document.querySelector(".error").style.display = "none";
    })
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

document.querySelector(".span-info-login").addEventListener("click", function(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href="register.html?" + infoUrl.toString();
})
loginButton.addEventListener("click", login);

function login(){
    console.log(document.getElementById("username-input").value);
    const myHeaders = new Headers();
    myHeaders.append("username", document.getElementById("username-input").value);
    myHeaders.append("password", document.getElementById("password-input").value);
    console.log(myHeaders);

    const fetchOptions = {
        method: "POST",
        "Content-Type": "application/json",
        headers: myHeaders,
    };

    fetch(url + "/login", fetchOptions)
    .then((response) =>{
        if(response.status === 200){
            
            //fazer clear dos erros
            return response.json();
        } else if(response.status === 401){
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
             //fazer caixa de aviso do erro
        } else if(response.status === 403){

            document.querySelector(".error").innerText = "Ocorreu um erro! Informação de login errada!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorLogin")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
            
        } else if(response.status ===444){
            
            document.querySelector(".error").innerText = "Aguarde que um administrador aprove a sua conta!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorWait")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);

        } else {
            console.log(response.status);
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
            //caixas
        }
    })
    .then((data) =>{
        if(data != null){
            console.log(data)
            //sessionStorage.setItem("token", data);
            //TIRAR SESSION STORAGEEEE



            infoUrl.append("lang", document.querySelector("select").value);
            infoUrl.append("tkn", data);
            window.location.href="index.html?" + infoUrl.toString();
        } else {
            //caixa de erro
        }
    })
}