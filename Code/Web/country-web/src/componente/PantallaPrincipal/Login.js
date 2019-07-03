import React, { Component } from "react";
import "../Style/Login.css";
import firebase from 'firebase'; 
import 'firebase/database'
import { DB_CONFIG } from '../../config/config';
import logo1 from '../../logo1.jpg'
import { Link } from 'react-router-dom'

class Login extends Component{  

    constructor(props){
        super(props);

        this.state = {email:'', password:'', result:false};

        this.ChangeEmail = this.ChangeEmail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.onButtonPress = this.onButtonPress.bind(this);

    }

    ChangeEmail(event) {
        this.setState({email: event.target.value});
      }
    ChangePass(event) {
        this.setState({password: event.target.value});
      }
    

    componentWillMount() {
      // Inicialización de Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(DB_CONFIG);
    }
      //firebase.initializeApp(DB_CONFIG);
  
    }
  
    onButtonPress() {
        
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({result: true})
      })
      .catch(() => {
          
        this.setState({result: false})
      })
    }

    


    render(){
        return(
          
            <div className="col-12"> 
              <div className="text-center jumbotron">     
                  <img src={logo1} width="300" height="129"></img>
                  <hr className="my-4"></hr>
              </div>              
              <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4 borde">
                <h2 className="text-center" >Iniciar sesion</h2>
            <div name="form" >
                <div className="form-group  " >
                    <label className=" font-weight-bold " type="email" htmlFor="username">Email</label>
                    <input  type="text" className="form-control" name="username" placeholder ="Email"
                    value={this.state.email}
                    onChange ={this.ChangeEmail}
                    hidden={false}
                     />
                </div>
                <div className='form-group' >
                    <label className="font-weight-bold" htmlFor="password">Password</label>
                    <input type = "password" className = " form-control" id = "exampleInputPassword1" placeholder = "Password"
                     value={this.state.password}
                     onChange ={this.ChangePass}
                     hidden={false}
                    />   
                </div>
                <div className="form-group izquierda">
                    <button className="btn btn-primary" onClick={this.onButtonPress}>Iniciar Sesion</button>
                </div>
                
            </div>
            </div>
            <div className="col-md-4"></div>
        </div>
     </div>

        );
    }
}

export default Login;