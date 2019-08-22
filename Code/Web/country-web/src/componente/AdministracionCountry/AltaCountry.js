import React, { Component } from 'react';
import "../Style/Alta.css";
import { Database } from '../../config/config';
import { Link } from 'react-router-dom'


class AltaCountry extends Component{
				
		constructor(){
			super();
			this.state = {
				nombre: '',
				calle: '',
				numero: '',
				titular: '',
				celular: '',
				descripcion: '',
				resultado: ''
			}
			this.addCountry = this.addCountry.bind(this);
		this.ChangeNombre = this.ChangeNombre.bind(this);
		this.ChangeCalle = this.ChangeCalle.bind(this);
		this.ChangeNumero = this.ChangeNumero.bind(this);
		this.ChangeTitular = this.ChangeTitular.bind(this);
		this.ChangeCelular = this.ChangeCelular.bind(this);
		this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
		this.registrar = this.registrar.bind(this);

		}


	addCountry(){
		Database.collection('Country').add({
			Nombre: this.state.nombre,
			Calle: this.state.calle,
			Numero: this.state.numero,
			Titular: this.state.titular,
			Celular: this.state.celular,
			Descripcion: this.state.descripcion,
		});

	}

	ChangeNombre(event) {
					this.setState({nombre : event.target.value});
	}
	ChangeCalle(event) {
					this.setState({calle: event.target.value});
			}
	ChangeNumero(event) {
					this.setState({numero: event.target.value});
	}

	ChangeCelular(event) {
		this.setState({celular : event.target.value});
}
ChangeTitular(event) {
	this.setState({titular : event.target.value});
}
ChangeDescripcion(event) {
	this.setState({descripcion : event.target.value});
}	

registrar(){
	//Agregar validaciones para no registrar cualquier gilada
	if(true){
		this.addCountry();
		this.setState({
			nombre: '',
			calle: '',
			numero: '',
			titular: '',
			celular: '',
			descripcion: '',
			resultado: 'Se registro con exito',
		})
	}
}


    render(){
        return(
            <div className="col-12">
            <div className="col-md-12 ">
			<div className="row">
				<legend>  Registrar Alta de un Barrio </legend>
					<div className = "col-md-6  flex-container form-group">
						<label for = "Nombre">  Nombre del Barrio </label>
						<input type = "name" className = "form-control"   placeholder = "Name Country"
						value={this.state.nombre}
						onChange ={this.ChangeNombre}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
						<label for = "Nombre">  Titular </label>
						<input type = "name" className = "form-control"   placeholder = "Name Headline"
						value={this.state.titular}
						onChange ={this.ChangeTitular}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
						<label for = "Nombre"> Calle </label>
						<input type = "name" className = "form-control"   placeholder = "Street"
						value={this.state.calle}
						onChange ={this.ChangeCalle}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
						<label for = "Nombre">  Celular </label>
						<input type = "name" className = "form-control"   placeholder = "Mobile"
						value={this.state.celular}
						onChange ={this.ChangeCelular}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
						<label for = "Nombre">  Numero </label>
						<input type = "name" className = "form-control"   placeholder = "Number"
						value={this.state.numero}
						onChange ={this.ChangeNumero}/>
					</div>
					
					
					<div className = "col-md-6  flex-container form-group">
						<label for = "Nombre">  Descripcion </label>
						<textarea className = "form-control" id = "exampleTextarea" rows = "3"  placeholder = "Description"
                             value = {this.state.descripcion}
                             onChange={this.ChangeDescripcion}> </textarea>
                        </div>
					<div>
						<span>
							<strong>{this.state.resultado}</strong>
						</span>
					</div>
          </div>
		  	<div>
				<span>
					<strong>{this.state.resultado}</strong>
				</span>
			</div>
          	<div className="form-group izquierda">
			      <button className="btn btn-primary boton" onClick= {this.registrar} >Registrar</button> 
            <Link to="/" type="button" className="btn btn-primary boton">Volver</Link>                 
		    </div>
        </div>
		
      </div>
        
        );
    }
}

export default AltaCountry;