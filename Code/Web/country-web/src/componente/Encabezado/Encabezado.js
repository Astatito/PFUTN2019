import React, {Component} from 'react';
import "./encabezado.css"


//<form className = "form-inline my-2 my-lg-0">
//<input className = "mr-sm-2" control de formulario  tipo = "texto" placeholder = "Buscar"/>
//<button type="button" className="btn btn-secondary" type="submit" >Buscar</button>

//</form>

class Encabezado extends Component{
    render(){
        return(
            <div className="fijado">
            <nav className = " navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
                <a className="navbar-brand" href="#"> Country  </a>
                <button className = "navbar-toggler" type = "button" data-toggle = "collapse" data-target = "# navbarColor01" aria-controls = "navbarColor01" aria-expand = "false" aria-label = "Navegación de palanca ">
                    <span className = "navbar-toggler-icon"> </span>
                </button>
            
                <div className = "collapse navbar-collapse" id = "navbarColor01">
                <ul className = "navbar-nav mr-auto">
                    <li className = "nav-item active">
                        <a className="nav-link" href="#">  Inicio <span class = "sr-only">(actual)  </ span > </a>
                    </li>
                    <li className = "nav-item">
                        <a className="nav-link" href="#"> Contacto  </a>
                    </li>                  
                </ul>
                <form className = "form-inline my-2 my-lg-0">
                    <label  className = " color mr-sm-2"> </label>
                    <button type="button" className="btn btn-secondary" type="submit" >Iniciar Sesion</button>
                   
                </form>
                </div>
          </nav>
          </div>


        );
    
    }
}

export default Encabezado;