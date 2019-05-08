import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import DefaultImg from './default_avatar.jpg'

import './style.scss'
import './style.css'
export default class Index extends Component {
  render() {
    console.log(process)
    return (
      <div>
        index
        <img src={`${DefaultImg}`} className='transImg' id="transImg"  />
        <div className='yellow'>Color Yellow</div>
      </div>
    )
  }
}

ReactDOM.render( <Index />,document.getElementById("app")  )


//这个在react项目配置中可加可不加,因为你在配置关于react babel的时候已经默认开启的了,可能如果你的项目不是react的话,可能需要开启这个选项,当开启这个选项,热替换才能生效
if(module.hot){
  module.hot.accept( (err)=>{
      if(err){
          console.log("Error !!!!")
      }
  } )
}
