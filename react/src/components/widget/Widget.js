import React from 'react'
import "./widget.css"

import {IntlProvider, FormattedMessage} from "react-intl";
import messages from '../../translations'
import { useSelector } from "react-redux";

export default function Widget() {

    const adminData = useSelector(state => state.updateGeneralInformation.dashStats);
    const totalNews = adminData.numNews;
    const totalProjects = adminData.numProjects;
    const totalUsers = adminData.numUsers;

    const locale = useSelector(state => state.updateGeneralInformation.urlInfo.lang);

  return (
    <IntlProvider locale={locale} messages ={messages[locale]}>
    <div className='widget-all'>
        <div className='widget'>
            <div className='widget-container'>
                <span className='widget-title'><FormattedMessage id={"numUsers"}/></span><br />
                <span className='widget-info'>{totalUsers}</span>
            </div>
        </div>
        <div className='widget'>
            <div className='widget-container'>
                <span className='widget-title'><FormattedMessage id={"numProjects"}/></span><br />
                <span className='widget-info'>{totalProjects}</span>
            </div>
        </div>
        <div className='widget'>
            <div className='widget-container'>
                <span className='widget-title'><FormattedMessage id={"numNews"}/></span><br />
                <span className='widget-info'>{totalNews}</span>
            </div>
        </div>
    </div>
    </IntlProvider>
  )
}
