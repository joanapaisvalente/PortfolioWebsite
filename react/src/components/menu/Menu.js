import {IntlProvider, FormattedMessage} from "react-intl";
import messages from '../../translations'
import { useSelector } from "react-redux";
import React from 'react'
import "./menu.css"

export default function Menu() {

  let infoUrl = new URLSearchParams();

  const urlInfo = useSelector(state => state.updateGeneralInformation.urlInfo);
  let locale = urlInfo.lang;
  const token = urlInfo.token;
  infoUrl.append("tkn",token);


  function clickProjectButton(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "feedProjects.html?" + infoUrl.toString();
  }

  function clickNewsButton(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "index.html?" + infoUrl.toString();
  }

  function clickTeamButton(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "team.html?" + infoUrl.toString();
  }

  function clickDashboardButton(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "dashboard.html?" + infoUrl.toString();
  }

  function clickUnapprovedUsersButton(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "acceptUser.html?" + infoUrl.toString();
  }

  function clickManageUsersButton(){
    infoUrl.append("lang", document.querySelector("select").value);
    window.location.href = "manageUsers.html?" + infoUrl.toString();
  }

  return (
    <IntlProvider locale={locale} messages ={messages[locale]}>
    <nav className="nav-bar">
        <div className = "nav-container">
            <button className="menu-button" id="projects-button" onClick={clickProjectButton}><FormattedMessage id={"btnProjects"}/></button>
            <button className="menu-button" id="news-button" onClick={clickNewsButton}><FormattedMessage id={"btnNews"}/></button>
            <button className="menu-button" id="team-button" onClick={clickTeamButton}><FormattedMessage id={"btnTeam"}/></button>
            <div className="dropdown menu-button" id="navbar_administracao">
                <button className="menu-button" id="admin-button"><FormattedMessage id={"btnAdmin"}/></button>
                <div className="dropdown-content">
                    <a className="dashboard" onClick={clickDashboardButton}>Dashboard</a>
                    <a className="wannabeMembers" onClick={clickUnapprovedUsersButton}><FormattedMessage id={"btnUnapproved"}/></a>
                    <a className="manageUsers" onClick={clickManageUsersButton}><FormattedMessage id={"btnManageUsers"}/></a>
                </div>
            </div>
        </div>
    </nav>
    </IntlProvider>
  )
}
