import Translator from "./translator.js";

//criar este objeto que vai ter as linguagens e a localização dos dicheiros 
var translator = new Translator({
  persist: false,
  languages: ["en", "pt"],
  defaultLanguage: "pt",
  detectLanguage: true,
  filesLocation: "/i18n"
});

let param = new URLSearchParams(window.location.search);
let language = param.get("lang");
if(language === null){
  language = "pt"
} 


//recuperar da url e passar em todas as páginas
//sem nada é default
translator.load(language);

//temos de ter selector para fazer set e automaticamente vai ao html verificar todos os elementos 
//que têm esta classe e vai alterar o valor para o que está no dicionário
document.querySelector("select").addEventListener("click", function(evt) {
    console.log(evt.target.value)
  if (evt.target.tagName === "SELECT") {
    //translator.load(evt.target.value);
    console.log(evt.target.value)
    translator.refresh_elements(evt.target.value);
    translate_dates(evt.target.value);
  }
});

export default function refreshLanguage(language){
  translator.refresh_elements(language);
}

export function translate_dates(lang){
  const elements = document.querySelectorAll("[data-i18n-date]");
      elements.forEach(element => {
        const data = new Date(element.getAttribute('data-i18n-date'));
          element.innerHTML=data.toLocaleString(lang);
      });
}