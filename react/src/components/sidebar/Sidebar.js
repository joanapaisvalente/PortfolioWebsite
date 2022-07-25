import React from 'react'
import "./sidebar.css"
import {IntlProvider, FormattedMessage} from "react-intl";
import messages from '../../translations'
import { useSelector } from "react-redux";

export default function Sidebar() {

  const userData = useSelector(state => state.updateGeneralInformation.sidebarInfo);
  const pic = userData.profilePic;
  const username = userData.username;
  const name = userData.fullName;
  const bio = userData.bio;

  let infoUrl = new URLSearchParams();

  const urlInfo = useSelector(state => state.updateGeneralInformation.urlInfo);
  let locale = urlInfo.lang;
  const token = urlInfo.token;
  infoUrl.append("tkn",token);

  function clickAddProjectButton(){

    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "addProject.html?" + infoUrl.toString();
  }

  function clickEditProfileButton(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "editProfile.html?" + infoUrl.toString();
  }

  function clickAddNewsButton(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "addNewsPiece.html?" + infoUrl.toString();
  }

  return (
    <IntlProvider locale={locale} messages ={messages[locale]}>
    <div className="side-bar" id="side-bar">
        <div className="side-bar-info" id="side-bar-info">
            <div className="side-bar-profile" id="side-bar-info">
                <img className="profile-picture" src={pic} />
                <span className="user-full-name" id={username}>{name}</span>
                <p className="user-biography">{bio}</p>
                <button className="button" id="edit-profile" onClick={clickEditProfileButton}><FormattedMessage id={"editProfile"}/></button>
                <button className="button" id="add-project" onClick={clickAddProjectButton}><FormattedMessage id={"addProject"}/></button>
                <button className="button" id="add-news"onClick={clickAddNewsButton}><FormattedMessage id={"addNews"}/></button>
            </div>
        </div>
    </div>
    </IntlProvider>
  )
}
