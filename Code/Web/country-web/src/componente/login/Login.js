import React, { Component } from "react";


class Login extends Component{

    render(){
        return(
         <form>
             <h2>Iniciar Sesion</h2>
            <div className="row">                
                <div className="form-group col-md-4">                
                    <label > Numero de documento </label>
                    <div className="form-group col-md-6">
                        <input type="text" name="nrodocumento" placeholder="Numero documento" ></input>
                    </div>
                </div>
            </div>
            <div className="row"> 
                <div className="form-group col-md-4">                
                    <label >Contraseña </label>
                    <div className="form-group col-md-6">
                        <input type="password" name="password" placeholder="Contraseña" ></input>
                    </div>
                </div>
            </div>
            <div className="form-group">
                    <div className="col-lg-offset-2 col-lg-10">
                        <input type="submit" value="Iniciar Sesion" class="btn btn-primary  btn-block"></input>
                    </div>
                </div>
         </form>

        );
    }
}

export default Login;