//const token = sessionStorage.getItem("token");
//const navbar = document.querySelector(".nav-container");
const newsBody = document.getElementById("news-body");
const searchButton = document.querySelector(".search-button")
let url = "http://localhost:8080/BackEndProjeto5/rest";
import refreshLanguage from "./changeLang.js"
import {translate_dates} from "./changeLang.js"
let infoUrl = new URLSearchParams();
let language 

let param = new URLSearchParams(window.location.search);

const lang = param.get("lang");
if(lang === null){
    language = "pt";
} else {
    language = lang;
}

document.querySelector("select").value = language;

const token = param.get("tkn");
console.log(token)

if(token != null){

    //adicionar notícias visiveis e invisiveis
    const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", token:token },
    };

    fetch(url + "/news/getNewsVisAndInvs", fetchOptions)
    .then((response) =>{
        if(response.status === 200){
            //limpar caixas erro
            console.log("200")
            return response.json();
        } else if(response.status === 401){
            //caixa erro
            document.querySelector(".error").innerText = "Ocorreu um erro a carregar as notícias!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorLoadingNews")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        } else if(response.status === 403){

            //caixa erro
            infoUrl.append("lang", document.querySelector("select").value);
            infoUrl.append("err", "4");
            window.location.href = "login.html?" + infoUrl.toString();
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
        loadNews(data);
    })

} else {

    //navbar.removeChild(document.getElementById("logout-button"));
    //navbar.removeChild(document.getElementById("navbar_administracao"));
    //caso não esteja ninguém com sessão iniciada, adiconar somente notícias visiveis
    fetch(url + "/news/findVisible")
    .then((response) =>{
        if(response.status === 200){
            return response.json();
        } else if(response.status === 401){
            //caixa de erro
            document.querySelector(".error").innerText = "Ocorreu um erro a carregar as notícias!"
            document.querySelector(".error").style.background = "#874681";
            document.querySelector(".error").style.color = "white";
            document.querySelector(".error").setAttribute("data-i18n","errorLoadingNews")
            document.querySelector(".error").addEventListener("click", function(){
                document.querySelector(".error").style.display = "none";
            })
            refreshLanguage(document.querySelector("select").value);
        } else {
            //caixa de erro
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
        loadNews(data);
    })
}

function loadNews(newsList){
    for(var i=0; i<newsList.length;i++){
        /*let lastUpdate = newsList[0].lastUpdate;
        lastUpdate = lastUpdate.split("T");
        let lastUpdateDate = lastUpdate[0].split("-");
        let lastUpdateHour = lastUpdate[1].split(":");
        let time = lastUpdateDate[2] + "-" + lastUpdateDate[1] + "-" + lastUpdateDate[0] + " " + lastUpdateHour[0] + ":" + lastUpdateHour[1]
        console.log(newsList[i].id)*/
        let image = newsList[i].image;
        if(image == null || image == ""){
            image = "defaultOverallPic.png";
        } 

        let article = document.createElement("article");
        article.className = "news-item";
        article.id = newsList[i].id;

        let title = document.createElement("h5");
        title.className="news-name";
        title.innerText = newsList[i].title;
        article.appendChild(title);

        let newsPic = document.createElement("img");
        newsPic.className = "news-image";
        newsPic.alt = newsList[i].title;
        newsPic.src = image;
        article.appendChild(newsPic);

        let div = document.createElement("div");
        div.className = "news-dates";

        let lastUpdated = document.createElement("span");
        lastUpdated.className = "news-last-update";
        lastUpdated.setAttribute("data-i18n", "lastUpdate");
        lastUpdated.innerText = "Última atualização: ";
        div.appendChild(lastUpdated);

        let date = document.createElement("span");
        date.className = "news-date";
        date.setAttribute("data-i18n-date", newsList[i].lastUpdate);
        date.innerText = newsList[i].lastUpdate;
        div.appendChild(date);

        let button = document.createElement("button");
        button.className = "button";
        button.id = "news-btn";
        button.setAttribute("data-i18n", "seeMore");
        button.innerText = "VER MAIS";
        button.addEventListener("click", seeNewsPiece);
        div.appendChild(button);

        article.appendChild(div);
        newsBody.appendChild(article);

        //FIM DO MÉTODO
        console.log(document.querySelector("select").value + "###################")
        refreshLanguage(document.querySelector("select").value);
        translate_dates(document.querySelector("select").value);

        /*let template = `<article class="news-item">
                            <h5 class="news-name">${newsList[i].title}</h5>
                            <img src="${image}" class="news-image" />
                            <div class="news-dates">
                                <p class="news-last-update" data-i18n="lastUpdate">Última atualização: </p><span class="news-date">${time}</span>
                                <button class="button" id="news-btn" data-i18n="seeMore">VER MAIS</button>
                            </div>
                        </article>`

        document.getElementById("news-body").innerHTML += template;*/
    }
}

searchButton.addEventListener("click", searchKeyword);

function searchKeyword(){
    const keywordInput = document.getElementById("keyword-input").value;

    if(keywordInput !== ""){
        console.log(keywordInput)

        if(token === null || token=== ""){

            fetch(url + "/news/search/visible/" + keywordInput)
            .then((response) => {
                if(response.status === 200){
                    //limpar erro
                    return response.json();
                } else if( response.status === 401){
                    //mostrar erro
                    document.querySelector(".error").innerText = "Ocorreu um erro!"
                    document.querySelector(".error").style.background = "#874681";
                    document.querySelector(".error").style.color = "white";
                    document.querySelector(".error").setAttribute("data-i18n","error")
                    document.querySelector(".error").addEventListener("click", function(){
                        document.querySelector(".error").style.display = "none";
                    })
                    refreshLanguage(document.querySelector("select").value);
                } else {
                    //mostrar erro
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
                //const newsBody = document.getElementById("news-body");
                while(newsBody.children.length >0){
                    newsBody.removeChild(newsBody.children[0]);
                }
                loadNews(data);
            })
        } else {
            const fetchOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json", token:token },
            };

            fetch(url + "/news/search/" + keywordInput, fetchOptions)
            .then((response) => {
                if(response.status === 200){
                    //limpar erro
                    return response.json();
                } else if( response.status === 401){
                    //mostrar erro
                    document.querySelector(".error").innerText = "Ocorreu um erro!"
                    document.querySelector(".error").style.background = "#874681";
                    document.querySelector(".error").style.color = "white";
                    document.querySelector(".error").setAttribute("data-i18n","error")
                    document.querySelector(".error").addEventListener("click", function(){
                        document.querySelector(".error").style.display = "none";
                    })
                    refreshLanguage(document.querySelector("select").value);
                } else {
                    //mostrar erro
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
                //const newsBody = document.getElementById("news-body");
                while(newsBody.children.length >0){
                    newsBody.removeChild(newsBody.children[0]);
                }
                loadNews(data);
            })
        }
    }
}

function seeNewsPiece (evt){

    //let infoUrl = new URLSearchParams();
    infoUrl.append("id", evt.target.parentElement.parentElement.id);
    infoUrl.append("lang", document.querySelector("select").value);

    if(token !== null){
        infoUrl.append("tkn", token);
    } else {
        infoUrl.delete("tkn");
    }

    window.location.href = "seeNewsPiece.html?" + infoUrl.toString();
}