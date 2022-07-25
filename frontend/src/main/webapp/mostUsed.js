//const tokenAux = sessionStorage.getItem("token");
let urlAux = "http://localhost:8080/BackEndProjeto5/rest/users";
import refreshLanguage from "./changeLang.js"

const navBar = document.querySelector(".nav-container");
let langAuX //= document.querySelector("select").value;
let infoUrlAux = new URLSearchParams();


let paramSearch = new URLSearchParams(window.location.search);
const tokenAux = paramSearch.get("tkn");
const lang = paramSearch.get("lang");
if(lang === null){
    langAuX = "pt";
} else {
    langAuX = lang;
}
document.querySelector("select").value = langAuX;
infoUrlAux.append("lang", document.querySelector("select").value);
if(tokenAux !== "" || tokenAux !== null){
    infoUrlAux.append("tkn", tokenAux);
}

document.querySelector("select").addEventListener("change", function(evt){
    langAuX = evt.target.value;
    infoUrlAux.delete("lang");
    infoUrlAux.append("lang", langAuX);
})




/*const projectButton = document.getElementById("projects-button");
const newsButton = document.getElementById("news-button");
const teamButton = document.getElementById("team-button");*/

navBar.addEventListener("click", function(evt){

    if(evt.target.id === "projects-button"){

        if(tokenAux === null){
            infoUrlAux.delete("tkn")
        }
        window.location.href="feedProjects.html?" + infoUrlAux.toString();
    } 

    if(evt.target.id === "news-button"){
        if(tokenAux === null){
            infoUrlAux.delete("tkn")
        }
        window.location.href="index.html?" + infoUrlAux.toString();
    } 

    if(evt.target.id === "team-button"){
        if(tokenAux === null){
            infoUrlAux.delete("tkn")
        }
        window.location.href = "team.html?" + infoUrlAux.toString();
    } 
})

if(tokenAux != null){

    //logout
    const logout = document.getElementById("logout-button");

    logout.addEventListener("click", function(){
        const fetchOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", token:tokenAux },
        };
        
        fetch(urlAux + "/logout", fetchOptions).then((response) => {
            if (response.status === 200) {
                //clear caixas erro
                sessionStorage.clear();
                infoUrlAux.delete("tkn")
                window.location.href = "index.html?" + infoUrlAux.toString();
            } else if (response.status === 401) {

                document.querySelector(".error").innerText = "Ocorreu um erro a realizar o terminar sessão!"
                document.querySelector(".error").style.background = "#874681";
                document.querySelector(".error").style.color = "white";
                document.querySelector(".error").setAttribute("data-i18n","errorLogout")
                document.querySelector(".error").addEventListener("click", function(){
                    document.querySelector(".error").style.display = "none";
                })
                refreshLanguage(document.querySelector("select").value);
                //fazer caixas erro
            } else if (response.status === 403){
                //infoUrl.append("lang", document.querySelector("select").value);
                infoUrlAux.delete("tkn")
                window.location.href = "login.html?" + infoUrlAux.toString();
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
        });
        
    })

    //insert user info
    loadUser();
} else {
    navBar.removeChild(document.getElementById("logout-button"));
    navBar.removeChild(document.getElementById("navbar_administracao"));

    //event listeners para os login e register do side bar
    document.getElementById("info-login").addEventListener("click", function(){
        infoUrlAux.delete("tkn");
        window.location.href="login.html?" + infoUrlAux.toString();
    });
    document.getElementById("info-register").addEventListener("click", function(){
        infoUrlAux.delete("tkn");
        window.location.href="register.html?" + infoUrlAux.toString();
    })
}

function loadUser(){

    const sidebar = document.getElementById("side-bar-info");

    while(sidebar.children.length >0){
        sidebar.removeChild(sidebar.children[0]);
    }

    const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", token:tokenAux },
    };

    fetch(urlAux, fetchOptions)
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
            //caixas erro
            infoUrlAux.append("lang", document.querySelector("select").value);
            infoUrlAux.append("err", "4");
            window.location.href = "login.html?" + infoUrlAux.toString();
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

        if(data.type === "member"){
            document.querySelector(".nav-container").removeChild(document.getElementById("navbar_administracao"));
        }

        let imageAux = data.profilePic;

        if(imageAux === null || imageAux === ""){
            imageAux = "defaultProfilePic.jpg";
        }

        sidebar.className = "side-bar-profile";

        const image = document.createElement("img");
        image.className = "profile-picture";
        image.src = imageAux;
        sidebar.appendChild(image);

        /*const lineBreak = document.createElement("br");
        sidebar.appendChild(lineBreak);*/

        const name = document.createElement("span");
        name.className = "user-full-name";
        name.innerText = data.firstName + " " + data.lastName;
        name.id = data.username;
        sidebar.appendChild(name);

        //sidebar.appendChild(lineBreak);

        const biography = document.createElement("p");
        biography.className ="user-biography";
        biography.innerText = data.biography;
        sidebar.appendChild(biography);

        const buttonEditProfile = document.createElement("button");
        buttonEditProfile.className = "button";
        buttonEditProfile.id = "edit-profile";
        buttonEditProfile.setAttribute("data-i18n", "editProfile");
        buttonEditProfile.innerText = "EDITAR PERFIL";
        buttonEditProfile.addEventListener("click", loadEditProfilePage);
        sidebar.appendChild(buttonEditProfile);

        const buttonAddProject = document.createElement("button");
        buttonAddProject.className = "button";
        buttonAddProject.id = "add-project";
        buttonAddProject.setAttribute("data-i18n", "addProject");
        buttonAddProject.innerText = "ADICIONAR PROJETO";
        buttonAddProject.addEventListener("click", addProject);
        sidebar.appendChild(buttonAddProject);

        const buttonAddNews = document.createElement("button");
        buttonAddNews.className = "button";
        buttonAddNews.id = "add-news";
        buttonAddNews.setAttribute("data-i18n", "addNews");
        buttonAddNews.innerText = "ADICIONAR NOTÍCIA";
        buttonAddNews.addEventListener("click", addNews);
        sidebar.appendChild(buttonAddNews);

        refreshLanguage(document.querySelector("select").value);

        if(data.type === "admin"){
            loadAdminMenuButtons();
        }
    })
}

function loadEditProfilePage(){
    window.location.href = "editProfile.html?" + infoUrlAux.toString();
}

function addProject(){
    window.location.href = "addProject.html?" + infoUrlAux.toString();
}

function addNews(){
    window.location.href = "addNewsPiece.html?" + infoUrlAux.toString();
}

function loadAdminMenuButtons(){
    document.querySelector(".dashboard").addEventListener("click", function(){
        window.location.href = "dashboard.html?" + infoUrlAux.toString();
    })

    document.querySelector(".wannabeMembers").addEventListener("click", function(){
        window.location.href = "acceptUser.html?" + infoUrlAux.toString();
    })

    document.querySelector(".manageUsers").addEventListener("click", function(){
        window.location.href = "manageUsers.html?" + infoUrlAux.toString();
    })
}