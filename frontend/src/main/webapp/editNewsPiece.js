const selectBox = document.querySelector(".news-coauthor-input");
let url = "http://localhost:8080/BackEndProjeto5/rest";
let infoUrl = new URLSearchParams();
import refreshLanguage from "./changeLang.js"
let language;
let arrayFeaturedProject = [];
//let arrayProjectToAdd = [];
//let arrayProjectToRemove = [];

let param = new URLSearchParams(window.location.search);
const token = param.get("tkn");
const newsId = param.get("id");
const langNow = param.get("lang");
if(langNow === null){
    language = "pt";
} else {
    language = langNow;
}
console.log("iiiiiiiiiiiiiii")
document.querySelector("select").value = language;
if(token !== null || token !== ""){

    loadNewsBoxes();

    
console.log("oooooooooooooooooo")
    //loadComboBox();

    document.getElementById("save-news-button").addEventListener("click", saveEditsToNewsPiece);
    document.querySelector(".add-coauthor").addEventListener("click", addCoauthorToList);
    document.querySelector(".add-keyword").addEventListener("click", addKeywordToList);

} else {
    infoUrl.append("lang", document.querySelector("select").value);
    infoUrl.append("err", "4");
    window.location.href = "login.html?" + infoUrl.toString();
}

function loadNewsBoxes(){
    fetch(url + "/news/get/" + newsId)
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

        let status = data.status;
        if(document.querySelector("select").value === "pt"){
            switch(status){
                case "visible": status="visivel"; break;
                case "invisible":status = "invisivel";break;
                case "deleted":status = "apagado";break;
            }
        }

        document.getElementById("news-title-input").value = data.title;
        document.getElementById("news-image-input").value = data.image;
        document.getElementById("news-description-input").value = data.description;
        document.querySelector(".news-toggle-visibility").value = status;
        console.log(document.querySelector(".news-toggle-visibility"))

        let arrayUsers = [];

        //get coauthor list
        fetch(url + "/news/members/list/" + newsId)
        .then((response) =>{
            if(response.status === 200){

                return response.json();
            } else if(response.status===401){
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
        })
        .then((data)=>{
            console.log(data)
            if(data.length>0){
                for(var h=0;h<data.length;h++){
                    const userToAdd = document.createElement("span");
                    userToAdd.className = "coauthor-item";
                    userToAdd.id = data[h].username;
                    userToAdd.innerText = data[h].firstName + " " + data[h].lastName;
                    userToAdd.addEventListener("click",removeUserToAdd);

                    arrayUsers.push(data[h].username);
                    
                    document.querySelector(".coauthor-container").appendChild(userToAdd);
                }
            }
        })

        console.log(arrayUsers)

        if(data.keywordList === ""){
            
        } else {
            const keywordsArray = data.keywordList.split(";");
            for(var j=0; j<keywordsArray.length; j++){
                const keywordSpan = document.createElement("span");
                keywordSpan.className = "keyword-item";
                keywordSpan.addEventListener("click",removeKeyword);
                keywordSpan.innerText = keywordsArray[j];

                document.querySelector(".keyword-container").appendChild(keywordSpan);
            }
        }
        loadComboBox(arrayUsers);
    })
}

function loadComboBox(featuredAuthors){

    const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", token:token },
    };

    fetch(url + "/users/listUsers", fetchOptions)
    .then((response) =>{
        if(response.status === 200){
            //erro
            return response.json();
        } else if(response.status === 401){
            //erro
            document.querySelector(".error").innerText = "Ocorreu um erro!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","error")
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
    .then((data)=>{
        console.log(data);
        //const loggedUsername = document.querySelector(".user-full-name").id;
        //console.log(loggedUsername, "22222222222222222222")
        for(var i =0; i<data.length; i++){

            //if(loggedUsername !== data[i].username){
                let verifyRepitition = false;
                for(var u=0;u<featuredAuthors.length;u++){
                    if(featuredAuthors[u]=== data[i].username){
                        verifyRepitition = true;
                    }
                }

                if(verifyRepitition === false){
                    const option = document.createElement("option");
                    option.className = "option-coauthor";
                    option.id = data[i].username;
                    option.innerText = data[i].username + ": " + data[i].firstName + " " + data[i].lastName;

                    selectBox.appendChild(option);
                }
            //}
        }
    })

    loadAssociatedProjects();
}

function loadAssociatedProjects(){
    
    fetch(url + "/news/" + newsId + "/projects")
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
    })
    .then((data)=>{
        console.log(data)

        if(data.length>0){
            for(var e=0;e<data.length;e++){

                arrayFeaturedProject.push(data[e].id);

                const article = document.createElement("article");
                article.className = "associated-projects-item";
                article.id = data[e].id;

                const trash = document.createElement("button");
                trash.className = "remove-project";
                trash.innerText = "X";
                trash.addEventListener("click", removeProjects);
                article.appendChild(trash)

                let image = data[e].image;
                if(image == null || image == ""){
                    image = "defaultOverallPic.png";
                } 
                const newsPic = document.createElement("img");
                newsPic.className = "project-pic";
                newsPic.src = image;
                article.appendChild(newsPic);

                const newsTitle = document.createElement("span");
                newsTitle.className = "project-title-span";
                newsTitle.innerText = data[e].title;
                article.appendChild(newsTitle);

                document.querySelector(".featured-projects").appendChild(article);
            }
        }
    })

    projectsToAssociateWith();
}

function projectsToAssociateWith(){
    const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", token:token },
    };

    fetch(url + "/projects/getProjectsVisAndInvs", fetchOptions)
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
    })
    .then((data) =>{
        console.log(data)

        if(data.length>0){
            for(var r=0;r<data.length;r++){

                let verifyNewsRepeted = false;

                for(var p=0;p<arrayFeaturedProject.length;p++){
                    if(arrayFeaturedProject[p] == data[r].id){
                        console.log("iguaissss")
                        verifyNewsRepeted = true;
                    }
                }

                if(verifyNewsRepeted === false){
                    const article = document.createElement("article");
                    article.className = "projects-to-associate-item";
                    article.id = data[r].id;

                    const add = document.createElement("button");
                    add.className = "add-project";
                    add.setAttribute("data-i18n","add");
                    add.innerText = "ADICIONAR";
                    add.addEventListener("click", addProject);
                    article.appendChild(add)

                    let image = data[r].image;
                    if(image == null || image == ""){
                        image = "defaultOverallPic.png";
                    } 
                    const newsPic = document.createElement("img");
                    newsPic.className = "project-pic";
                    newsPic.src = image;
                    article.appendChild(newsPic);

                    const newsTitle = document.createElement("span");
                    newsTitle.className = "project-title-span";
                    newsTitle.innerText = data[r].title;
                    article.appendChild(newsTitle);

                    document.querySelector(".projects-to-associate").appendChild(article);
                }
            }
        }
    })
    refreshLanguage(document.querySelector("select").value);
}

function removeProjects(evt){

    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
    const articleAux = evt.target.parentElement;

    //console.log(arrayFeaturedProject);
    const projectToRemove = evt.target.parentElement.id;
    //arrayFeaturedNews.splice(arrayFeaturedNews.indexOf(newsToRemove), 1);
    //console.log(arrayFeaturedProject);
    //arrayProjectToRemove.push(projectToRemove);

    //console.log(arrayNewsToRemove);

    document.querySelector(".featured-projects").removeChild(document.getElementById(projectToRemove))

    const article = document.createElement("article");
    article.className = "projects-to-associate-item";
    article.id = articleAux.id;

    const add = document.createElement("button");
    add.className = "add-project";
    add.setAttribute("data-i18n","add");
    add.innerText = "ADICIONAR";
    add.addEventListener("click", addProject);
    article.appendChild(add)

    let image = articleAux.children[1].src;
    const newsPic = document.createElement("img");
    newsPic.className = "project-pic";
    newsPic.src = image;
    article.appendChild(newsPic);

    const newsTitle = document.createElement("span");
    newsTitle.className = "project-title-span";
    newsTitle.innerText = articleAux.children[2].innerText;
    article.appendChild(newsTitle);

    

    //document.querySelector(".news-to-associate").append(article);
    console.log(article)


    /*for(var t=0;t<arrayFeaturedNews.length;t++){
        if(arrayFeaturedNews[t] == newsToRemove){
            arrayFeaturedNews.re
        }
    }*/
    ///desassociate/{idProject}/and/{idNews}

    //FAZER FETCH
    console.log("vamos apagar esta noticia")
    console.log(projectToRemove);

    const fetchAssociate = {
        method:"POST",
        headers: { "Content-Type": "application/json", token:token}
    }
    fetch(url + "/news/desassociate/" + articleAux.id + "/and/" + newsId, fetchAssociate)
    .then((response) =>{
        console.log(response.status);
        if(response.status === 200){
            console.log("200")
            document.querySelector(".projects-to-associate").appendChild(article);
            
        } else if(response.status === 401){
            document.querySelector(".error").innerText = "Ocorreu um erro a desassociar!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorDesassociate")
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

function addProject(evt){

    ///unite/{idProject}/with/{idNews}
    const articleAux = evt.target.parentElement;

    //console.log(arrayFeaturedProject);
    const projectToAdd = evt.target.parentElement.id;
    //arrayFeaturedNews.push(newsToAdd);
    //arrayProjectToAdd.push(projectToAdd);
    //console.log(arrayFeaturedProject);

    document.querySelector(".projects-to-associate").removeChild(document.getElementById(projectToAdd))

    const article = document.createElement("article");
    article.className = "associated-projects-item";
    article.id = articleAux.id;

    const trash = document.createElement("button");
    trash.className = "remove-project";
    trash.innerText = "X";
    trash.addEventListener("click", removeProjects);
    article.appendChild(trash)

    console.log(articleAux.children[1].src, "EEEEEEEEEEEEEEEEEEEEEEEE")
    let image = articleAux.children[1].src;
    const projectPic = document.createElement("img");
    projectPic.className = "project-pic";
    projectPic.src = image;
    article.appendChild(projectPic);

    const projectTitle = document.createElement("span");
    projectTitle.className = "project-title-span";
    projectTitle.innerText = articleAux.children[2].innerText;
    article.appendChild(projectTitle);

    //FAZER FETCH
    const fetchAssociate = {
        method:"POST",
        headers: { "Content-Type": "application/json", token:token}
    }
    fetch(url + "/news/unite/" + articleAux.id + "/with/" + newsId, fetchAssociate)
    .then((response) =>{
        console.log(response.status);
        if(response.status === 200){
            console.log("200")
            document.querySelector(".featured-projects").appendChild(article);
            //arrayNewsToAdd.splice(0, 1);
            //console.log(arrayNewsToAdd.length);
        } else if(response.status === 401){
            document.querySelector(".error").innerText = "Ocorreu um erro a associar!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorAssociate")
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

function addCoauthorToList(){

    let user = document.getElementById("news-coauthor-input").value.split(":");

    const userToAdd = document.createElement("span");
    userToAdd.className = "coauthor-item";
    userToAdd.id = user[0];
    userToAdd.innerText = user[1];
    userToAdd.addEventListener("click",removeUserToAdd);
    
    document.querySelector(".coauthor-container").appendChild(userToAdd);
    document.querySelector(".news-coauthor-input").value = "";
    let authorOptions = document.querySelectorAll(".option-coauthor");
    for(var o=0;o<authorOptions.length;o++){
        if(authorOptions[o].id === user[0]){
            document.querySelector(".news-coauthor-input").remove(o);
        }
    }
}

function addKeywordToList(){

    document.getElementById("news-keyword-input").style.color = "black";

    let keywordToAdd = document.getElementById("news-keyword-input").value;

    if(keywordToAdd !== ""){
        const keywordsListLoaded = document.querySelectorAll(".keyword-item") 
        console.log(keywordsListLoaded)
        let verifyKeywordRepitition = false;
        if(keywordsListLoaded.length >0){
            for(var j = 0; j<keywordsListLoaded.length;j++){
                if(keywordToAdd.toLowerCase() === keywordsListLoaded[j].innerText.toLowerCase()){
                    verifyKeywordRepitition=true;
                    console.log(keywordsListLoaded[j].innerText, "SSSSSSSSSSSSSSSS")
                }
            }
        }
        
        if(verifyKeywordRepitition === false){
            const keywordSpan = document.createElement("span");
            keywordSpan.className = "keyword-item";
            keywordSpan.innerText = keywordToAdd;

            document.querySelector(".keyword-container").appendChild(keywordSpan);
            document.getElementById("news-keyword-input").value = "";
        } else {
            document.getElementById("news-keyword-input").style.color = "red";
        }
    }
}

function saveEditsToNewsPiece(){

    if(document.getElementById("news-title-input").value == "" || document.getElementById("news-description-input").value ==""){
        document.querySelector(".error").innerText = "Preencha as caixas de texto!"
        document.querySelector(".error").style.background = "#874681";
        document.querySelector(".error").style.color = "white";
        document.querySelector(".error").setAttribute("data-i18n","errorBoxes")
        document.querySelector(".error").addEventListener("click", function(){
            document.querySelector(".error").style.display = "none";
        })
        refreshLanguage(document.querySelector("select").value);
    } else {

        let arrayAuthorsUsernames = [];
        const authorList = document.querySelectorAll(".coauthor-item");
        if(authorList.length>0){
            for(var k=0;k<authorList.length;k++){
                console.log(authorList[k].id)
                arrayAuthorsUsernames.push(authorList[k].id);
            }
        }
        
        let arrayKeyword = "";
        const keywordList = document.querySelectorAll(".keyword-item");
        if(keywordList.length>0){
            let semicolonCount = keywordList.length - 1;
            for(var u=0;u<keywordList.length;u++){
                console.log(keywordList[u].innerText);
                console.log(semicolonCount);
                let text = keywordList[u].innerText
                arrayKeyword=arrayKeyword.concat(text);
                if(semicolonCount>0){
                    arrayKeyword=arrayKeyword.concat(";");
                    console.log(arrayKeyword);
                    semicolonCount = semicolonCount-1;
                    console.log(semicolonCount)
                }
            }
        } else {
            arrayKeyword = "";
        }
        console.log(arrayKeyword);

        let visibilityAux = document.querySelector(".news-toggle-visibility").value;
            if(document.querySelector("select").value === "pt"){
                switch(visibilityAux){
                    case "visivel": visibilityAux="visible"; break;
                    case "invisivel":visibilityAux="invisible"; break;
                    case "apagado":visibilityAux="deleted"; break;
                    default:visibilityAux="visible"; break;
                }
            }

            //console.log(visibilityAux);

        const fetchBody = JSON.stringify({
            title:document.getElementById("news-title-input").value,
            id:parseInt(newsId),
            description:document.getElementById("news-description-input").value,
            image:document.getElementById("news-image-input").value,
            coauthorList:arrayAuthorsUsernames,
            status:visibilityAux,
            keywordList:arrayKeyword
        })
        
        console.log(fetchBody)

        const fetchEditNews = {
            method:"POST",
            headers: { "Content-Type": "application/json", token:token},
            body: fetchBody,
        }

        fetch(url + "/news/edit/" + newsId, fetchEditNews)
        .then((response) =>{
            if(response.status === 200){

                document.querySelector(".success").innerText = "Alterações guardadas com sucesso!";
                document.querySelector(".success").setAttribute("data-i18n","successSaving")
                document.querySelector(".success").addEventListener("click", function(){
                    document.querySelector(".success").style.display = "none";
                })
                refreshLanguage(document.querySelector("select").value);

            } else if(response.status === 401){
                //erro
                document.querySelector(".error").innerText = "Ocorreu um erro a editar a notícia!"
                document.querySelector(".error").style.background = "#874681";
                document.querySelector(".error").style.color = "white";
                document.querySelector(".error").setAttribute("data-i18n","errorEditingNews")
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
    //associateNewsToProject();
}

function removeKeyword(evt){
    console.log(evt.target);
    document.querySelector(".keyword-container").removeChild(evt.target);
}

function removeUserToAdd(evt){
    console.log(evt.target)
    document.querySelector(".coauthor-container").removeChild(evt.target);

    const option = document.createElement("option");
    option.className = "option-coauthor";
    option.id = evt.target.id;
    option.innerText = evt.target.id + ": " + evt.target.innerText;

    selectBox.appendChild(option);
}