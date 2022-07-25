let url = "http://localhost:8080/BackEndProjeto5/rest/users/";
const teamDiv = document.querySelector(".team-div");
import refreshLanguage from "./changeLang.js"
let language 

let param = new URLSearchParams(window.location.search);
const token = param.get("tkn");
const projectId = param.get("id");
if(projectId === ""){
    //mensagem de aviso
    window.location.href = "index.html?err=2";
}
const lang = param.get("lang");
console.log(lang)
if(lang === null){
    language = "pt";
} else {
    language = lang;
}

document.querySelector("select").value = language;

document.addEventListener("DOMContentLoaded", loadAdmin);

function loadAdmin(){
    console.log("quen lo diria")
    fetch(url + "listAllAdmins")
    .then((response) =>{
        if(response.status === 200){
            //limpar erro
            return response.json();
        } else if(response.status === 401){
            //errooooo
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
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
    .then((data) =>{
        
        if(data.length >0){

            for(var i =0; i<data.length;i++){
                console.log(data)
                const article = document.createElement("article");
                article.className = "admin-info";
                article.id = data[i].username;

                const userPic = document.createElement("img");
                userPic.className = "admin-profile-pic";
                userPic.src = data[i].profilePic;
                article.appendChild(userPic);

                const userFullName = document.createElement("span");
                userFullName.className = "admin-full-name";
                userFullName.innerText = data[i].firstName + " " + data[i].lastName;
                article.appendChild(userFullName);

                const userEmail = document.createElement("p");
                userEmail.className = "admin-email";
                userEmail.innerText = data[i].email;
                article.appendChild(userEmail);

                teamDiv.appendChild(article);
            }
        }
    })
    refreshLanguage(document.querySelector("select").value);
}