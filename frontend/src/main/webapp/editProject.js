const selectBox = document.querySelector(".project-coauthor-input");
let url = "http://localhost:8080/BackEndProjeto5/rest";
let infoUrl = new URLSearchParams();
import refreshLanguage from "./changeLang.js"
let language;
let arrayFeaturedNews = [];
//let arrayNewsToAdd = [];
//let arrayNewsToRemove = [];

let param = new URLSearchParams(window.location.search);
const token = param.get("tkn");
const projId = param.get("id");
const langNow = param.get("lang");
if(langNow === null){
    language = "pt";
} else {
    language = langNow;
}
console.log("iiiiiiiiiiiiiii")
document.querySelector("select").value = language;
if(token !== null || token !== ""){

    loadProjectBoxes();

    
console.log("oooooooooooooooooo")
    //loadComboBox();

    document.getElementById("save-project-button").addEventListener("click", saveEditsToProject);
    document.querySelector(".add-coauthor").addEventListener("click", addCoauthorToList);
    document.querySelector(".add-keyword").addEventListener("click", addKeywordToList);

} else {
    infoUrl.append("lang", document.querySelector("select").value);
    infoUrl.append("err", "4");
    window.location.href = "login.html?" + infoUrl.toString();
}

function loadProjectBoxes(){
    fetch(url + "/projects/get/" + projId)
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

        console.log(data)

        let status = data.status;
        if(document.querySelector("select").value === "pt"){
            switch(status){
                case "visible": status="visivel"; break;
                case "invisible":status = "invisivel";break;
                case "deleted":status = "apagado";break;
            }
        }

        document.getElementById("project-title-input").value = data.title;
        document.getElementById("project-image-input").value = data.image;
        document.getElementById("project-description-input").value = data.description;
        document.querySelector(".project-toggle-visibility").value = status;

        let arrayUsers = [];

        //get coauthor list
        fetch(url + "/projects/members/list/" + projId)
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
            
        }else {
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
        } else if(response.status === 403) {
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

    loadAssociatedNews();
}

function loadAssociatedNews(){
    
    fetch(url + "/projects/" + projId + "/news")
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

                arrayFeaturedNews.push(data[e].id);

                const article = document.createElement("article");
                article.className = "associated-news-item";
                article.id = data[e].id;

                const trash = document.createElement("button");
                trash.className = "remove-news";
                trash.innerText = "X";
                trash.addEventListener("click", removeNews);
                article.appendChild(trash)

                let image = data[e].image;
                if(image == null || image == ""){
                    image = "defaultOverallPic.png";
                } 
                const newsPic = document.createElement("img");
                newsPic.className = "newspiece-pic";
                newsPic.src = image;
                article.appendChild(newsPic);

                const newsTitle = document.createElement("span");
                newsTitle.className = "newspiece-title";
                newsTitle.innerText = data[e].title;
                article.appendChild(newsTitle);

                document.querySelector(".featured-news").appendChild(article);
            }
        }
    })

    newsToAssociateWith();
}

function newsToAssociateWith(){
    const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", token:token },
    };

    fetch(url + "/news/getNewsVisAndInvs", fetchOptions)
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

                for(var p=0;p<arrayFeaturedNews.length;p++){
                    if(arrayFeaturedNews[p] == data[r].id){
                        console.log("iguaissss")
                        verifyNewsRepeted = true;
                    }
                }

                if(verifyNewsRepeted === false){
                    const article = document.createElement("article");
                    article.className = "news-to-associate-item";
                    article.id = data[r].id;

                    const add = document.createElement("button");
                    add.className = "add-news";
                    add.setAttribute("data-i18n","add");
                    add.innerText = "ADICIONAR";
                    add.addEventListener("click", addNews);
                    article.appendChild(add)

                    let image = data[r].image;
                    if(image == null || image == ""){
                        image = "defaultOverallPic.png";
                    } 
                    const newsPic = document.createElement("img");
                    newsPic.className = "newspiece-pic";
                    newsPic.src = image;
                    article.appendChild(newsPic);

                    const newsTitle = document.createElement("span");
                    newsTitle.className = "newspiece-title";
                    newsTitle.innerText = data[r].title;
                    article.appendChild(newsTitle);

                    document.querySelector(".news-to-associate").appendChild(article);
                }
            }
        }
    })
    refreshLanguage(document.querySelector("select").value);
}

function removeNews(evt){

    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
    const articleAux = evt.target.parentElement;

    //console.log(arrayFeaturedNews);
    const newsToRemove = evt.target.parentElement.id;
    //arrayFeaturedNews.splice(arrayFeaturedNews.indexOf(newsToRemove), 1);
    console.log(arrayFeaturedNews);
    //arrayNewsToRemove.push(newsToRemove);

    //console.log(arrayNewsToRemove);

    document.querySelector(".featured-news").removeChild(document.getElementById(newsToRemove))

    const article = document.createElement("article");
    article.className = "news-to-associate-item";
    article.id = articleAux.id;

    const add = document.createElement("button");
    add.className = "add-news";
    add.setAttribute("data-i18n","add");
    add.innerText = "ADICIONAR";
    add.addEventListener("click", addNews);
    article.appendChild(add)

    let image = articleAux.children[1].src;
    const newsPic = document.createElement("img");
    newsPic.className = "newspiece-pic";
    newsPic.src = image;
    article.appendChild(newsPic);

    const newsTitle = document.createElement("span");
    newsTitle.className = "newspiece-title";
    newsTitle.innerText = articleAux.children[2].innerText;
    article.appendChild(newsTitle);

    document.querySelector(".news-to-associate").appendChild(article);

    console.log(article)

    console.log("vamos apagar esta noticia")
    console.log(newsToRemove);

    //FAZER AQUI O FETCH
    const fetchAssociate = {
        method:"POST",
        headers: { "Content-Type": "application/json", token:token}
    }
    fetch(url + "/news/desassociate/" + projId + "/and/" + articleAux.id, fetchAssociate)
    .then((response) =>{
        console.log(response.status);
        if(response.status === 200){
            console.log("200")
            //arrayNewsToAdd.splice(0, 1);
            //console.log(arrayNewsToAdd.length);
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

function addNews(evt){

    ///unite/{idProject}/with/{idNews}
    const articleAux = evt.target.parentElement;

    //console.log(arrayFeaturedNews);
    const newsToAdd = evt.target.parentElement.id;
    //arrayFeaturedNews.push(newsToAdd);
    //arrayNewsToAdd.push(newsToAdd);
    //console.log(arrayNewsToAdd);

    document.querySelector(".news-to-associate").removeChild(document.getElementById(newsToAdd))

    const article = document.createElement("article");
    article.className = "associated-news-item";
    article.id = articleAux.id;

    const trash = document.createElement("button");
    trash.className = "remove-news";
    trash.innerText = "X";
    trash.addEventListener("click", removeNews);
    article.appendChild(trash)

    console.log(articleAux.children[1].src, "EEEEEEEEEEEEEEEEEEEEEEEE")
    let image = articleAux.children[1].src;
    const newsPic = document.createElement("img");
    newsPic.className = "newspiece-pic";
    newsPic.src = image;
    article.appendChild(newsPic);

    const newsTitle = document.createElement("span");
    newsTitle.className = "newspiece-title";
    newsTitle.innerText = articleAux.children[2].innerText;
    article.appendChild(newsTitle);

    document.querySelector(".featured-news").appendChild(article);

    //FAZER AQUI O FETCH
    const fetchAssociate = {
        method:"POST",
        headers: { "Content-Type": "application/json", token:token}
    }
    fetch(url + "/news/unite/" + projId + "/with/" + articleAux.id, fetchAssociate)
    .then((response) =>{
        console.log(response.status);
        if(response.status === 200){
            console.log("200")
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

    let user = document.getElementById("project-coauthor-input").value.split(":");

    const userToAdd = document.createElement("span");
    userToAdd.className = "coauthor-item";
    userToAdd.id = user[0];
    userToAdd.innerText = user[1];
    userToAdd.addEventListener("click",removeUserToAdd);
    
    document.querySelector(".coauthor-container").appendChild(userToAdd);
    document.querySelector(".project-coauthor-input").value = "";
    let authorOptions = document.querySelectorAll(".option-coauthor");
    for(var o=0;o<authorOptions.length;o++){
        if(authorOptions[o].id === user[0]){
            document.querySelector(".project-coauthor-input").remove(o);
        }
    }
}

function addKeywordToList(){

    document.getElementById("project-keyword-input").style.color = "black";

    let keywordToAdd = document.getElementById("project-keyword-input").value;

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
            document.getElementById("project-keyword-input").value = "";
        } else {
            document.getElementById("project-keyword-input").style.color = "red";
        }
    }
}

function saveEditsToProject(){

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

    let visibilityAux = document.querySelector(".project-toggle-visibility").value;
    if(document.querySelector("select").value === "pt"){
        switch(visibilityAux){
            case "visivel": visibilityAux="visible"; break;
            case "invisivel":visibilityAux="invisible"; break;
            case "apagado":visibilityAux="deleted"; break;
            default:visibilityAux="visible"; break;
        }
    }

    const fetchBody = JSON.stringify({
        title:document.getElementById("project-title-input").value,
        id:projId,
        description:document.getElementById("project-description-input").value,
        image:document.getElementById("project-image-input").value,
        coauthorList:arrayAuthorsUsernames,
        status:visibilityAux,
        keywordList:arrayKeyword
    })

    console.log(fetchBody)

    const fetchEditProject = {
        method:"POST",
        headers: { "Content-Type": "application/json", token:token},
        body: fetchBody,
    }

    fetch(url + "/projects/edit/" + projId, fetchEditProject)
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
            document.querySelector(".error").innerText = "Ocorreu um erro a editar o projeto!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorEditingProject")
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