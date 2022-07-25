import React from 'react'
import {IntlProvider, FormattedMessage} from "react-intl";
import messages from '../../translations'
import { useSelector } from "react-redux";
import "./informationSquare.css"

export default function InformationSquare() {

    const adminData = useSelector(state => state.updateGeneralInformation.dashStats);
    const newsTitle = adminData.mostRecentNews.title;
    const newsDate = adminData.mostRecentNews.date;
    const projectTitle = adminData.mostRecentProject.title;
    const projectDate = adminData.mostRecentProject.date;

    const locale = useSelector(state => state.updateGeneralInformation.urlInfo.lang);

  return (
    <IntlProvider locale={locale} messages ={messages[locale]}>
    <div className='informationSquare-all'>
        <div className='informationSquare'>
          <div className='informationSquare-container'>
            <h6 className='informationSquare-title'><FormattedMessage id={"recentNews"}/></h6>
            <p className='informationSquare-name'>{newsTitle}</p>
            <span className='informationSquare-date'><FormattedMessage id={"recentDate"} values={{t:Date.parse(newsDate)}} /></span>
          </div>
        </div>
        <div className='informationSquare'>
          <div className='informationSquare-container'>
            <h6 className='informationSquare-title'><FormattedMessage id={"recentProject"}/></h6>
            <p className='informationSquare-name'>{projectTitle}</p>
            <span className='informationSquare-date'><FormattedMessage id={"recentDate"} values={{t:Date.parse(projectDate)}} /></span>
          </div>
        </div>
    </div>
    </IntlProvider>
  )
}
