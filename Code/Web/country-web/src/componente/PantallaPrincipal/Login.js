import React, { Component } from "react";
import "../Style/Login.css";
import firebase from 'firebase'; 
import 'firebase/database'
import {Firebase} from '../../config/config';
import {Database} from '../../config/config';
import Icono from "../Img/Icono.jpeg"
import { Link } from 'react-router-dom'
import InicioAdministrador from '../AdministracionAdministrador/InicioAdministrador';
import Encabezado from "../Encabezado/Encabezado";


class Login extends Component{  

    constructor(props){
        super(props);

        this.state = {
          email:'', 
          password:'',
          user: null, 
          result:false,
          tipoUsuario:''
        };
        this.authListener = this.authListener.bind(this);
        this.ChangeEmail = this.ChangeEmail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.onButtonPress = this.onButtonPress.bind(this);
        this.obtenerTipoUsuario = this.obtenerTipoUsuario.bind(this)

    }

    ChangeEmail(event) {
        this.setState({email: event.target.value});
      }
    ChangePass(event) {
        this.setState({password: event.target.value});
      }
    
    componentDidMount() {
      this.authListener();
    
      
    }
    // componentWillMount() {
    //   // Inicialización de Firebase
    //   if (!firebase.apps.length) {
    //     firebase.initializeApp(DB_CONFIG);
    // }
      //firebase.initializeApp(DB_CONFIG);
  
    obtenerTipoUsuario(){
      Database.collection('Usuarios').doc(this.state.email).get()
        .then(doc => {
    
          if (doc.exists) {
            this.state.tipoUsuario=doc.data().TipoUsuario.id
           
            console.log(this.state.tipoUsuario)
          } else {
            //Si no existe, hacer esto...
          }
        })
        .catch(err => {
          //En caso de error, hacer esto...
        })
      }
      
      

    authListener() {
      Firebase.auth().onAuthStateChanged((user) => {
        
        if (user) {
          this.setState({ user });
          localStorage.setItem('user', user.uid);
          
        } else {
          this.setState({ user: null });
          localStorage.removeItem('user');
        }
      });
      
    }
   async onButtonPress() {
        
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({result: true})
        this.obtenerTipoUsuario();
      })
      .catch(() => {
          
        this.setState({result: false})
      })
    }

    


    render(){
      const {  user}=this.state;
      if (!user){  
        return(
            <div className="col-12  "> 
              <div className="text-center "> 
                  <div className="espacio"></div>    
                  <img  src={Icono} width="300" height="228"></img>
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
                    <button className="btn btn-primary" 
                    onClick={this.onButtonPress}>                      
                    Iniciar Sesion</button>
                </div>
                
            </div>
            </div>
            <div className="col-md-4"></div>
        </div>
     </div>

        );} else {
          return(
                <div>
                  <Encabezado
                  tipoU = {this.state.tipoUsuario}></Encabezado>
                  {/* <Link to={this.state.tipoUsuario} type="button" className="btn btn-primary" type="submit" >Agregar Servicio</Link>
                 */}

                  <InicioAdministrador></InicioAdministrador>
                </div>
          )
        }
    }
}

export default Login;