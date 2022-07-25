import React from 'react'
import "./home.css"
import Widget from '../../components/widget/Widget'
import Boxes from '../../components/boxes/Boxes'
import InformationSquare from '../../components/InformationSquare/InformationSquare'

export default function home() {
  
  return (
    <div className='home'>
      <div className='container'>
        <Widget />
        <h5 className='keywords'>Keywords: </h5>
        <Boxes />
        <InformationSquare />
      </div>  
      
    </div>
  )
}
