import React, {useState} from 'react'
import  {loadUrlInfor} from "../../redux/actions/actions.js"
import "./header.css"
import { useSelector } from "react-redux";
import store from '../../redux/store'

export default function Header() {

  const urlData = useSelector(state => state.updateGeneralInformation.urlInfo);
  let lang = urlData.lang;
  const token = urlData.token;

  const [locale, setLocale] = useState("en")

  function handleSelect(e) {

    lang = e.target.value;

    const dataUrl = {
      lang:lang,
      token:token
    }

    store.dispatch(loadUrlInfor(dataUrl));

    setLocale(e.target.value)
  }

  return (
    <div className="header">
        <span className="company-name">MUSEARCH</span>
        <select className="lang" onChange={handleSelect} defaultValue={locale} value={lang}>
          <option key="pt">pt</option>
          <option key="en">en</option>
        </select>
    </div>
  )
}