import React, { Component } from "react";
import "./Login.css";

class Login extends Component{  
    render(){
        return(
            <div className="col-12">
            
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4 borde">
                <h2 className="text-center" >Iniciar sesion</h2>
            <form name="form" >
                <div className="form-group  " >
                    <label className=" font-weight-bold " type="email" htmlFor="username">Email</label>
                    <input type="text" className="form-control" name="username"placeholder ="Email" />
                </div>
                <div className='form-group' >
                    <label className="font-weight-bold" htmlFor="password">Password</label>
                    <input type = "password" className = " form-control" id = "exampleInputPassword1" placeholder = "Password"/>   
                </div>
                <div className="form-group izquierda">
                    <button className="btn btn-primary">Iniciar Sesion</button>
                   
                
                </div>
                </form>
            </div>
            <div className="col-md-4"></div>
        </div>
     </div>

        );
    }
}

export default Login;