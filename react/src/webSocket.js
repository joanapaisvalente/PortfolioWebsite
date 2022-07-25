import  {updateBoxes, loadSidebar, loadUrlInfor} from "./redux/actions/actions"
var wsocket;

let paramSearch = new URLSearchParams(window.location.search);
const token = paramSearch.get("tkn");
const lang = paramSearch.get("lang");
//let token = "Basic rpbL7GYWssevmLGhdx-Nyuw1U1Tp-jkC" 
//let lang = "pt";

export const callWebSocket = function(dispatcher){

const urlInfo = {
  lang:lang,
  token:token
}

dispatcher(loadUrlInfor(urlInfo));

let userJson= {
  token: token
}

document.addEventListener("DOMContentLoaded", getUsername);

function getUsername() {
    const fetchUser = {
      method: "GET",
      headers: { "Content-Type": "application/json", token: token },
    };
    fetch("http://localhost:8080/BackEndProjeto5/rest/users", fetchUser)
    .then((response) => {
      if(response.status === 200){
        return response.json();
      
      } else if (response.status === 401 || response.status === 403){
        console.log("erro:" + response.status)
      }
    })
    .then((data) => {

      dispatcher(loadSidebar(data));
        
      connect(data.username);
  });
}


function connect(username) {

  wsocket = new WebSocket(
    "ws://localhost:8080/BackEndProjeto5/adminInfo/" + username,
 );
 
  wsocket.onmessage = onMessage;
}

function onMessage(evt) {

  wsocket.send(JSON.stringify(userJson));

  var jsonData = JSON.parse(evt.data);

  dispatcher(updateBoxes(jsonData));
}
}