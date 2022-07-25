let url = "http://localhost:8080/BackEndProjeto5/rest/projects/";
//const token = sessionStorage.getItem("token");
const body = document.getElementById("project-info");
import refreshLanguage from "./changeLang.js"
import {translate_dates} from "./changeLang.js"
let language;
let projectMemberList = null;
let admin = false;
let infoUrl = new URLSearchParams();

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

document.addEventListener("DOMContentLoaded", loadProject);

function loadProject(){
    fetch(url + "get/" + projectId)
    .then((response) =>{
        if(response.status === 200){

            //limpar erro
            return response.json();
        } else if (response.status === 401){
            //caixa erro
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        } else {
            //caixa erro
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
        console.log(data.keywordList)

        body.id = data.id;

        
        if(data.image == null || data.image == ""){
            body.removeChild(document.querySelector(".img-project"))
            console.log("kkk")
            
        } else {
            document.querySelector(".img-project").src = data.image;
            document.querySelector(".img-project").alt = data.title;
        }

        document.querySelector(".title-project").innerText = data.title;

        document.querySelector(".owner-project").innerText=data.owner.firstName + " " + data.owner.lastName;
        document.querySelector(".owner-project").id = data.owner.username;

        if(data.coauthorList === null){
            //body.removeChild(document.querySelector(".associates-project"));
            //body.removeChild(document.getElementById("label-colab"));
        }else {

            projectMemberList = data.coauthorList;
            if(data.coauthorList.length >0){

                //console.log(document.querySelector(".user-full-name").id, "ALOOOOO IRMÃOS")

                fetch(url + "members/list/" + data.id)
                .then((response) =>{
                    if(response.status === 200){

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
                }).then((data)=>{
                    console.log(data)
                    for(var y=0;y<data.length;y++){
                        const author = document.createElement("span");
                        author.className = "coauthor-item";
                        author.innerText = data[y].firstName + " " + data[y].lastName;
                        author.id = data[y].username;
                        document.querySelector(".associates-project").appendChild(author);
                        
                    }
                })
                /*let associates = "";
                for(var i = 0;i<data.coauthorList.length; i++){
                    associates += data.coauthorList[i] + " . ";
                }
            document.querySelector(".associates-project").innerText = associates;*/
            } else {
                //body.removeChild(document.querySelector(".associates-project"));
            }
        }
        

        document.querySelector(".descrip-project").innerText = data.description;

        document.querySelector(".date-project").innerText = data.lastUpdate;
        document.querySelector(".date-project").setAttribute("data-i18n-date", data.lastUpdate);

        if(data.keywordList === null || data.keywordList === ""){
            console.log("estou null")
            body.removeChild(document.querySelector(".keyword-label"));
        } else {
            console.log("não estou null")
            let arrayKeywords = data.keywordList.split(";");
        
            for(var j=0; j<arrayKeywords.length; j++){
                const keyword = document.createElement("span");
                keyword.className = "keyword-item";
                keyword.innerText = arrayKeywords[j];
                console.log(keyword)
                document.querySelector(".keywords-project").appendChild(keyword);
            }
        }
        loadFeaturedNews();
    })
}

function loadFeaturedNews(){
    fetch(url + projectId + "/news")
    .then((response) =>{
        if(response.status === 200){
            //limpar erros
            return response.json();
        } else if (response.status === 401){
            //erros
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        } else {
            //erros
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
            translate_dates(document.querySelector("select").value);
        }
    })
    .then((data) =>{
        console.log(data)
        if(data.length > 0){
            for(var k=0;k<data.length;k++){
                let article = document.createElement("article");
                article.className = "featured-news-item";
                article.id = data[k].id;

                let image = data[k].image;
                if(image == null || image == ""){
                    console.log("kkk")
                    image = "defaultOverallPic.png";
                } 
                let projPic = document.createElement("img");
                projPic.className = "featured-news-image";
                projPic.alt = data[k].title;
                projPic.src = image;
                article.appendChild(projPic);

                let title = document.createElement("h5");
                title.className="featured-news-name";
                title.innerText = data[k].title;
                article.appendChild(title);

                article.addEventListener("click", goToNews);
                //event listener

                document.querySelector(".featured-news").appendChild(article);
            }
            
        } else {
            body.removeChild(document.querySelector(".featured-title"));
        }
    })
    translate_dates(document.querySelector("select").value);
    checkIfEditButton();
}

function checkIfEditButton(){

    console.log("heloooo")
    console.log(token)
    console.log(admin)

    console.log(document.getElementById("navbar_administracao"))
    if(document.getElementById("navbar_administracao") === null){
        admin = false;
    } else {
        admin = true;
    }
    console.log(admin)

    const usernameSideBar = document.querySelector(".user-full-name").id;
    if(token !== null){

        const usernameProjectOwner = document.querySelector(".owner-project").id;

        setTimeout(loadButton, 400, usernameSideBar, usernameProjectOwner, admin);
    } 
}

function loadButton(usernameSideBar, usernameProjectOwner, admin){
    if(usernameSideBar === usernameProjectOwner || admin === true){
        console.log("oippppppppppp")
        const editButton = document.createElement("button");
        editButton.className = "edit-project-button button";
        editButton.setAttribute("data-i18n", "edit");
        editButton.innerText = "EDITAR";
        editButton.addEventListener("click", function(){
            const projectId = body.id;
            console.log(projectId)
            //let infoUrl = new URLSearchParams();
            infoUrl.append("tkn", token);
            infoUrl.append("lang", document.querySelector("select").value);
            infoUrl.append("id", projectId);
            //console.log(infoUrl.toString())
            window.location.href = "editProject.html?" + infoUrl.toString();
        });

        body.appendChild(editButton);
    }
    checkIfAssociateButton(usernameSideBar);
}

function checkIfAssociateButton(username){
    
    console.log()
    if(token !== null){
        //const username = document.querySelector(".user-full-name").id;
        if(projectMemberList !== null){
        
            console.log(projectMemberList)
            
            console.log(username)
            let verify = false;
            for(let t=0;t<projectMemberList.length;t++){
    
                if(verify === false){
                    if(projectMemberList[t] == username){
                        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
                        const desassociate = document.createElement("button");
                        desassociate.className = "desassociate-project-button button";
                        desassociate.setAttribute("data-i18n", "desassociate");
                        desassociate.innerText = "DESASSOCIAR";
                        desassociate.addEventListener("click", desassociateUser);
    
                        body.appendChild(desassociate);
                        verify = true;
                        break;
                    }
                }
            }
    
            if(verify === false){
                console.log("wwwwwwwwwwwwwwwww", document.querySelector(".owner-project").id)
                console.log(username)

                if(username === document.querySelector(".owner-project").id){
                    console.log("user é ownserrrr")
                } else {
                    const associate = document.createElement("button");
                    associate.className = "associate-project-button button";
                    associate.setAttribute("data-i18n", "associate");
                    associate.innerText = "ASSOCIAR";
                    associate.addEventListener("click", associateUser);
    
                    body.appendChild(associate);
                }
            }
        } else {
            if(username === document.querySelector(".owner-project").id){
                console.log("user é ownserrrr!!!!!!!!!!!!!!")
            } else {
                const associate = document.createElement("button");
                associate.className = "associate-project-button button";
                associate.setAttribute("data-i18n", "associate");
                associate.innerText = "ASSOCIAR";
                associate.addEventListener("click", associateUser);

                body.appendChild(associate);
            }
        }
    } 

    refreshLanguage(document.querySelector("select").value);
}

function desassociateUser(){
    const username = document.querySelector(".user-full-name").id;

    const fetchAssociate = {
        method:"POST",
        headers: { "Content-Type": "application/json", token:token}
    }

    fetch(url + "members/" + projectId, fetchAssociate)
    .then((response) =>{
        console.log(response.status);
        if(response.status === 200){
            console.log("200")
            body.removeChild(document.querySelector(".desassociate-project-button"));

            const authors = document.querySelectorAll(".coauthor-item");
            console.log(authors.length);

            for(let w=0;w<authors.length;w++){
                console.log(authors[w].id);
                if(authors[w].id === username){
                    console.log("IGUALLL")
                    document.querySelector(".associates-project").removeChild(authors[w]);
                }
            }

            const associate = document.createElement("button");
            associate.className = "associate-project-button button";
            associate.setAttribute("data-i18n", "associate");
            associate.innerText = "ASSOCIAR";
            associate.addEventListener("click", associateUser);

            body.appendChild(associate);
            refreshLanguage(document.querySelector("select").value);
            //body.remove(document.querySelector(".desassociate-project-button"));

            //arrayNewsToAdd.splice(0, 1);
            //console.log(arrayNewsToAdd.length);
        } else if(response.status === 401){
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
    refreshLanguage(document.querySelector("select").value);
}

function associateUser(){

    const fetchAssociate = {
        method:"POST",
        headers: { "Content-Type": "application/json", token:token}
    }

    fetch(url + "members/" + projectId, fetchAssociate)
    .then((response) =>{
        console.log(response.status);
        if(response.status === 200){
            console.log("200")
            body.removeChild(document.querySelector(".associate-project-button"));

            const author = document.createElement("span");
            author.className = "coauthor-item";
            author.innerText = document.querySelector(".user-full-name").innerText;
            author.id = document.querySelector(".user-full-name").id;
            document.querySelector(".associates-project").appendChild(author);

            const desassociate = document.createElement("button");
            desassociate.className = "desassociate-project-button button";
            desassociate.setAttribute("data-i18n", "desassociate");
            desassociate.innerText = "DESASSOCIAR";
            desassociate.addEventListener("click", desassociateUser);
    
            body.appendChild(desassociate);
            refreshLanguage(document.querySelector("select").value);
            //body.remove(document.querySelector(".desassociate-project-button"));

            //arrayNewsToAdd.splice(0, 1);
            //console.log(arrayNewsToAdd.length);
        } else if(response.status === 401){
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
}


function goToNews(evt){
    console.log(evt.target.tagName)
    let newsId="";
    if(evt.target.tagName === "ARTICLE"){
        newsId = evt.target.id;
        
    }
    if(evt.target.tagName === "IMG" || evt.target.tagName === "H5"){
        newsId = evt.target.parentElement.id;
        console.log(newsId)
    }
    /*if(evt.target.tagName === "H5"){
        projId = evt.target.parentElement.id;
        console.log(projId)
    }*/

    //let infoUrl = new URLSearchParams();
    infoUrl.append("id", newsId);
    infoUrl.append("lang", document.querySelector("select").value);

    if(token !== null){
        infoUrl.append("tkn", token);
    } else {
        infoUrl.delete("tkn")
    }

    window.location.href = "seeNewsPiece.html?" + infoUrl.toString();
    
}