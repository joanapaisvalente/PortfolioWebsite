let url = "http://localhost:8080/BackEndProjeto5/rest/";
import refreshLanguage from "./changeLang.js"
let infoUrl = new URLSearchParams();
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

document.addEventListener("DOMContentLoaded", loadUsersToManage);

function loadUsersToManage(){

    const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", token:token },
    };

    fetch(url + "admin/listAllUsers", fetchOptions)
    .then((response)=>{
        if(response.status === 200){

            return response.json();
        } else if(response.status === 401){
            document.querySelector(".error").innerText = "Ocorreu um erro a listar os utilizadores!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorloadingUserList")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);

        } else if(response.status === 403){
            infoUrl.append("lang", document.querySelector("select").value);
            infoUrl.append("err", "4");
            window.location.href = "login.html?" + infoUrl.toString();
        }else {
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        }

    }).then((data) =>{
        console.log(data);
        for(let r=0;r<data.length;r++){

            const item = document.createElement("li");
            item.className = "user-item"
            item.id = data[r].username;

            const span = document.createElement("span");
            span.className = "name";
            span.innerText = data[r].username + ": " + data[r].firstName + " " + data[r].lastName;
            item.appendChild(span)

            const div = document.createElement("div");
            div.className = "button-div";

            if(data[r].type === "admin"){
                console.log("admin")
                //document.querySelector(".adminList").appendChild(item);

                const button = document.createElement("button");
                button.className = "toggle-user-admin";
                button.setAttribute("data-i18", "turn-member")
                button.innerText = "TORNAR MEMBRO"
                button.addEventListener("click",manageAdmin);

                div.appendChild(button);
                item.appendChild(div);
                document.querySelector(".adminList").appendChild(item);


            } else {
                console.log("member")
                //document.querySelector(".memberList").appendChild(item);

                const buttonMember = document.createElement("button");
                buttonMember.className = "toggle-user-member";
                buttonMember.setAttribute("data-i18", "turn-admin")
                buttonMember.innerText = "TORNAR ADMINISTRADOR"
                buttonMember.addEventListener("click",manageMember);

                /*const buttonVisitor = document.createElement("button");
                buttonVisitor.className = "toggle-user-visitor";
                buttonVisitor.setAttribute("data-i18", "turn-visitor")
                buttonVisitor.innerText = "TORNAR VISITANTE"
                buttonVisitor.addEventListener("click",manageMemberToVisitor)*/

                div.appendChild(buttonMember);
                //div.appendChild(buttonVisitor);
                item.appendChild(div);
                document.querySelector(".memberList").appendChild(item);
                

            }
        }
    })
    //refreshLanguage(document.querySelector("select").value);
}

function manageAdmin(evt){
    const loggedUsername = document.querySelector(".user-full-name").id;
    const userInButton = evt.target.parentElement.parentElement.id;
    //console.log(document.querySelector(".user-full-name").id)
    console.log(evt.target.parentElement.parentElement.id);

    if(loggedUsername === userInButton){
        console.log("NÃO MEXE")
    } else {
        console.log("MEXE")
        const fetchOptions = {
            method:"POST",
            headers: { "Content-Type": "application/json", token:token}
        }

        fetch(url + "admin/updateToAdmin/" + userInButton, fetchOptions)
        .then((response) =>{
            if(response.status === 200){
                document.querySelector(".adminList").removeChild(evt.target.parentElement.parentElement);
                //evt.target.parentElement.parentElement.removeChild(document.querySelector(".button-div"));

                const item = document.createElement("li");
                item.className = "user-item"
                item.id = userInButton;

                const span = document.createElement("span");
                span.className = "name";
                span.innerText = evt.target.parentElement.parentElement.children[0].innerText;
                item.appendChild(span)

                const div = document.createElement("div");
                div.className = "button-div";

                const buttonMember = document.createElement("button");
                buttonMember.className = "toggle-user-member";
                buttonMember.setAttribute("data-i18", "turn-admin")
                buttonMember.innerText = "TORNAR ADMINISTRADOR"
                buttonMember.addEventListener("click",manageAdmin);

                div.appendChild(buttonMember);
                item.appendChild(div);
                document.querySelector(".memberList").appendChild(item);

            } else if(response.status === 401){
                //erro
                document.querySelector(".error").innerText = "Ocorreu um erro a mudar o tipo do utilizador!"
                document.querySelector(".error").style.background = "#874681";
                document.querySelector(".error").style.color = "white";
                document.querySelector(".error").setAttribute("data-i18n","errorUserStatus")
                document.querySelector(".error").addEventListener("click", function(){
                    document.querySelector(".error").style.display = "none";
                })
                refreshLanguage(document.querySelector("select").value);

            } else if(response.status === 403){
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
    refreshLanguage(document.querySelector("select").value);
}

function manageMember(evt){

    const userInButton = evt.target.parentElement.parentElement.id;

    const fetchOptions = {
        method:"POST",
        headers: { "Content-Type": "application/json", token:token}
    }

    fetch(url + "admin/updateToAdmin/" + userInButton, fetchOptions)
    .then((response) =>{
        if(response.status === 200){
            document.querySelector(".memberList").removeChild(evt.target.parentElement.parentElement);
                //evt.target.parentElement.parentElement.removeChild(document.querySelector(".button-div"));

                const item = document.createElement("li");
                item.className = "user-item"
                item.id = userInButton;

                const span = document.createElement("span");
                span.className = "name";
                span.innerText = evt.target.parentElement.parentElement.children[0].innerText;
                item.appendChild(span)

                const div = document.createElement("div");
                div.className = "button-div";

                const button = document.createElement("button");
                button.className = "toggle-user-admin";
                button.setAttribute("data-i18", "turn-member")
                button.innerText = "TORNAR MEMBRO"
                button.addEventListener("click",manageAdmin);

                div.appendChild(button);
                item.appendChild(div);
                document.querySelector(".adminList").appendChild(item);

        } else if(response.status === 401){
            //erro
            document.querySelector(".error").innerText = "Ocorreu um erro a mudar o tipo do utilizador!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorUserStatus")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);

        } else if(response.status === 403){
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
    refreshLanguage(document.querySelector("select").value);
}