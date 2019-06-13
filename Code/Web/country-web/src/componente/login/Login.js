import React, { Component } from "react";


class Login extends Component{

    render(){
        return(
            <div className="col-md-6 col-md-offset-3">
            <h2>Iniciar sesion</h2>
            <form name="form" >
                <div className="form-group justify-content-center" >
                    <label className="font-weight-bold" htmlFor="username">Username</label>
                    <input type="text" className="form-control" name="username" value="" />
                </div>
                <div className='form-group' >
                    <label className="font-weight-bold" htmlFor="password">Password</label>
                    <input type="password" className="form-control" name="password" value=""/>
                    
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">Iniciar Sesion</button>
                   
                
                </div>
            </form>
        </div>

        );
    }
}

export default Login;