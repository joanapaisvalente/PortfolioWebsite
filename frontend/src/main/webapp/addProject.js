const selectBox = document.querySelector(".project-coauthor-input");
import refreshLanguage from "./changeLang.js"
let url = "http://localhost:8080/BackEndProjeto5/rest";
let infoUrl = new URLSearchParams();
let language;

let param = new URLSearchParams(window.location.search);
const token = param.get("tkn");
const langNow = param.get("lang");
if(langNow === null){
    language = "pt";
} else {
    language = langNow;
}
document.querySelector("select").value = language;
console.log("iiiiiiiiiiiiiii")
if(token !== null || token !== ""){

    
console.log("oooooooooooooooooo")
    loadComboBox();

    document.getElementById("save-project-button").addEventListener("click", saveCreatedProject);
    document.querySelector(".add-coauthor").addEventListener("click", addCoauthorToList);
    document.querySelector(".add-keyword").addEventListener("click", addKeywordToList);

} else {
    infoUrl.append("lang", document.querySelector("select").value);
    infoUrl.append("err", "4");
    window.location.href = "login.html?" + infoUrl.toString();
}

function loadComboBox(){

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
                const option = document.createElement("option");
                option.className = "option-coauthor";
                option.id = data[i].username;
                option.innerText = data[i].username + ": " + data[i].firstName + " " + data[i].lastName;

                selectBox.appendChild(option);
            //}
        }
    })
}

function addCoauthorToList(){

    let user = document.getElementById("project-coauthor-input").value.split(":");

    const userToAdd = document.createElement("span");
    userToAdd.className = "coauthor-item";
    userToAdd.id = user[0];
    userToAdd.innerText = user[1];
    
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

function saveCreatedProject(){

    if(document.getElementById("project-title-input").value == "" || document.getElementById("project-description-input").value ==""){
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
        
        const fetchBody = JSON.stringify({
            title:document.getElementById("project-title-input").value,
            description:document.getElementById("project-description-input").value,
            image:document.getElementById("project-image-input").value,
            coauthorList:arrayAuthorsUsernames,
            keywordList:arrayKeyword
        })

        const fetchCreateProject = {
            method:"POST",
            headers: { "Content-Type": "application/json", token:token},
            body: fetchBody,
        }

        fetch(url + "/projects/create", fetchCreateProject)
        .then((response)=>{
            if(response.status === 200){
                console.log("okkk")
                infoUrl.append("lang", document.querySelector("select").value)
                infoUrl.append("tkn", token);
                window.location.href = "feedProjects.html?" + infoUrl.toString();
            } else if(response.status === 401){
                //erro
                document.querySelector(".error").innerText = "Ocorreu um erro a criar o projeto!"
                document.querySelector(".error").style.background = "#874681";
                document.querySelector(".error").style.color = "white";
                document.querySelector(".error").setAttribute("data-i18n","errorCreatingProject")
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
}