import refreshLanguage from "./changeLang.js"
let language;
var wsocket;
let wsData;
let username;
let currentUsers = [];
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
//console.log(usernameAux)

document.addEventListener("DOMContentLoaded", getUsername);

function getUsername() {
    const fetchUser = {
        method: "GET",
        headers: { "Content-Type": "application/json", token: token },
    };
    fetch("http://localhost:8080/BackEndProjeto5/rest/users", fetchUser)
    .then((response) => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 401) {
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        } else if(response.status === 403){
            infoUrl.append("lang", document.querySelector("select").value);
            infoUrl.append("err", "4");
            window.location.href = "login.html?" + infoUrl.toString();
        } else {
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
    .then((data) => {

        username = data.username;
        console.log(data.type)

        if (username != null || username != "" && data.type === "admin") {
            connect();
        }
    });
}

function connect() {

    wsocket = new WebSocket("ws://localhost:8080/BackEndProjeto5/adminInfo/" + username);
    var tokenJson = {
		token: token
	}

	wsocket.addEventListener("open", function() {
		wsocket.send(JSON.stringify(tokenJson));
	});
    wsocket.onmessage = onMessage;
}

function onMessage(evt) {
    
    wsData = JSON.parse(evt.data);
    console.log(wsData)

    loadUsers(wsData.listUnapproved);

    const userJson = {
        token: token
    };
    wsocket.send(JSON.stringify(userJson));

    /**,
        usernameToChange:"teresa",
        action:"DELETE" */
}

function loadUsers(users){

    console.log(users)

    const divToAdd = document.querySelector(".userList");
    if(users.length >0){
        for(let i=0;i<users.length;i++){

            if (!currentUsers.includes(users[i].username)) {

                console.log("estou na condição")

                currentUsers.push(users[i].username);

                const item = document.createElement("li");
                item.className = "user-item";
                item.id = users[i].username;

                const span = document.createElement("span");
                span.className = "name";
                span.innerText = users[i].username + ": " + users[i].firstName + " " + users[i].lastName;
                item.appendChild(span)

                console.log("estou na condição 2", span)

                const div = document.createElement("div");
                div.className = "button-div";

                const buttonApprove = document.createElement("button");
                buttonApprove.className = "toggle-approve fa fa-check";
                buttonApprove.addEventListener("click",manageMember);

                console.log("estou na condição 2", buttonApprove)

                const buttonDelete = document.createElement("button");
                buttonDelete.className = "toggle-delete fa fa-trash-o";
                buttonDelete.addEventListener("click",removeUser)

                console.log("estou na condição 2", buttonApprove)

                div.appendChild(buttonApprove);
                div.appendChild(buttonDelete);
                item.appendChild(div);
                divToAdd.appendChild(item);
            }
        }
    }
}

function removeUser (evt){
    console.log(evt.target.parentElement.parentElement)

    const userJson = {
        token: token,
        usernameToChange:evt.target.parentElement.parentElement.id,
        action:"DELETE"
    };
    wsocket.send(JSON.stringify(userJson));

    document.querySelector(".userList").removeChild(evt.target.parentElement.parentElement);

    /**,
        usernameToChange:"teresa",
        action:"DELETE" */
}

function manageMember(evt){

    const userJson = {
        token: token,
        usernameToChange:evt.target.parentElement.parentElement.id,
        action:"UPGRADE"
    };
    wsocket.send(JSON.stringify(userJson));

    document.querySelector(".userList").removeChild(evt.target.parentElement.parentElement);
}