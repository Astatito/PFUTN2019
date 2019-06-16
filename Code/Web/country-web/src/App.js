import React, { Component } from 'react';
import Login from "./componente/login/Login";
import Encabezado from "./componente/Encabezado/Encabezado";
import "./estilo.css";
import logo1 from "./logo1.jpg";

// para probar encabezado poner <Encabezado></Encabezado>
// <h1 className="display-3 text-center">Come in </h1>

class App extends Component{
  render(){
    return(
      <div className="app container-fluid ">        
        <div className="jumbotron  "> 
        <Encabezado></Encabezado>
          <div className="text-center">     
          <img src={logo1} width="300" height="129"></img>
          </div>  
          <hr className="my-4"></hr>
        </div>
        <Login ></Login>
        
      </div>


    );
  }
}

export default App;
