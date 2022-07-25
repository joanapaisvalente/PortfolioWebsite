import React from 'react'
import {IntlProvider, FormattedMessage} from "react-intl";
import messages from '../../translations'
import "./boxes.css"
import { useSelector } from "react-redux";

export default function Boxes() {

    const adminData = useSelector(state => state.updateGeneralInformation.dashStats);
    const numKeywordsNews = adminData.numUniqueKeywordsNews;
    const numKeywordsProject = adminData.numUniqueKeywordsProject;
    const numKeywordsOverAll = adminData.numUniqueKeywordsOverAll;

    const locale = useSelector(state => state.updateGeneralInformation.urlInfo.lang);

  return (
    <IntlProvider locale={locale} messages ={messages[locale]}>
    <div className='boxes-all'>
        <div className='box'>
            <div className='box-container'>
                <span className='box-title'><FormattedMessage id={"keywordsNews"}/></span><br />
                <span className='box-info'>{numKeywordsNews}</span>
            </div>
        </div>
        <div className='box middle'>
            <div className='box-container'>
                <span className='box-title'><FormattedMessage id={"allKeywords"}/></span><br />
                <span className='box-info'>{numKeywordsOverAll}</span>
            </div>
        </div>
        <div className='box'>
            <div className='box-container'>
                <span className='box-title'><FormattedMessage id={"keywordsProjects"}/></span><br />
                <span className='box-info'>{numKeywordsProject}</span>
            </div>
        </div>
    </div>
    </IntlProvider>
  )
}
