import React, { Component } from 'react';
import Login from "./componente/login/Login";


class App extends Component{
  render(){
    return(
      <div className="app container">
        <div className="jumbotron">
          <p className="lead text-center">Pass Country</p>
        </div>
        <Login></Login>
      </div>


    );
  }
}

export default App;
