import React, { Component } from 'react';
import "../../Style/Alta.css";
import {Database} from "../../../config/config"
import {Link} from 'react-router-dom'


class AltaServicio extends Component{

    constructor(){
        super();
        this.state = {
            nombre: '',
            estado: true,
            disponibilidad: '',
            idCountry: '',
            resultado: '',
            dias:['',''],
            nombreDias:['Lun','Mar']
        }
        this.addServicio= this.addServicio.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeRadio  = this.ChangeRadio.bind(this);
        this.ChangeDias = this.ChangeDias.bind(this);
        this.registrar = this.registrar.bind(this);

    }

    componentDidMount(){
        Database.collection('Administradores').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Usuario === localStorage.getItem('mail')){
                        this.state.idCountry = doc.data().IdCountry
                }
            });
        })
    }

    componentDidUpdate(){
        
    }

    addServicio(){
        var dbRef = Database.collection('Servicios')
        dbRef.add({
            Nombre: this.state.nombre,
            Estado: this.state.estado=== 'Si'?true:false,
            Disponibilidad: this.state.disponibilidad,
            IdCountry: this.state.idCountry,
        });

    }

    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    
    ChangeDescripcion(event) {
        this.setState({descripcion : event.target.value});
    }

    ChangeRadio(event){
      this.setState({disponibilidad: event.currentTarget.value})
  }
    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.addServicio();
        }
    }

    ChangeDias(event){
        const e = event.target;
        if(e.checked){
           this.state.dias[e.name] = this.state.nombreDias[e.name];
            
        } else{ 
            this.state.dias[e.name] = '';
        }
    }

    render(){
        return(
            <div className="col-12">
                
            <div>
            <div className="col-md-12 ">
            
            <div className="row">
                <legend><h1>  Registrar Alta</h1> </legend>
                    <div className = "col-md-12 flex-container form-group">
                        <label for = "NombreServicio"> Nombre del Servicio  </label>
                        <input  type = "name" className = "col-md-6 form-control"  
                         placeholder = "Name Service"
                         value={this.state.nombre}
                         onChange={this.ChangeNombre}/>
                    </div>
                    <div className = "col-md-12 flex-container form-group">
                        <label for = "FechaNacimiento">  Dias disponibles  </label>
                        <div>
                        {/* checked={this.state.isGoing} onChange={this.handleInputChange} */}
                        {/* <label><input name='0' value="Lun" type="checkbox" checked={this.state.dias[0] === 'Lun'} onChange={this.ChangeDias} />Lun </label>
                        <label><input name='1' value="Mar" type="checkbox" checked={this.state.dias[1] === 'Mar'} />Mar </label>
                        <label><input name='2' value="Mie" type="checkbox" checked={this.state.dias[2] === 'Mie'} />Mie </label>
                        <label><input name='3' value="Jue" type="checkbox" checked={this.state.dias[3] === 'Jue'} />Jue </label>
                        <label><input name='4' value="Vie" type="checkbox" checked={this.state.dias[4] === 'Vie'} />Vie </label>
                        <label><input name='5' value="Sab" type="checkbox" checked={this.state.dias[5] === 'Sab'} />Sab </label>
                        <label><input name='6' value="Dom" type="checkbox" checked={this.state.dias[6] === 'Dom'} />Dom </label> */}
                         <label><input name='0' value="Lun" type="checkbox" checked={this.state.dias[0] === 'Lun'} onChange={this.ChangeDias} />Lun </label>
                        <label><input name='1' value="Mar" type="checkbox" checked={this.state.dias[1] === 'Mar'} onChange={this.ChangeDias} />Mar </label>
   
                        </div>
                    </div>
                    <fieldset className = "form-group">
                            <legend>  Estado  </legend>
                                <div className = "form-check">
                                    <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input"  
                                    value = 'Si' checked={this.state.disponibilidad === 'Si'}
                                    onChange={this.ChangeRadio} />
                                        Disponibile
                                    </label>
                                </div>
                                <div className = "form-check">
                                    <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input" value = 'No'
                                    onChange={this.ChangeRadio} checked={this.state.disponibilidad === 'No'} />
                                            No Disponibile
                                    </label>
                                </div>
                        </fieldset>
                    <div className = "col-md-12 flex-container form-group">
                        <label for = "exampleTextarea"> Descripcion  </ label >
                        <textarea className = "col-md-6 form-control" id = "exampleTextarea" rows = "3"
                         value={this.state.descripcion}
                         onChange={this.ChangeDescripcion}> </textarea>
                    </div>
                </div>
            
            <div className="form-group izquierda">
                <button className="btn btn-primary" onClick={this.registrar}>Registrar</button>                  
            </div>
            </div>
            </div>
        </div>
        
        );
    }
}
export default AltaServicio;