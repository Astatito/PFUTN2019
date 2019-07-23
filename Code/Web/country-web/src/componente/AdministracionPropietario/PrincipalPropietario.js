import React, { Component } from 'react';
import "../Style/Alta.css";
import { Database } from "../../config/config";
import { Link } from 'react-router-dom'
import Propietario from "./Propietario";


class PrincipalPropietario extends Component{

    constructor(){
        super();
        this.state= {
            propietarios: []
        }

    }

    async componentDidMount(){
        const { propietarios } = this.state;
        await Database.collection('Propietarios').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {

                this.state.propietarios.push(
                    [doc.data(), doc.id]
                )

            });
        });
        this.setState({propietarios});
        console.log(this.state.propietarios);
    }

    render(){
        return(
            <div></div>
        );
    }
}

export default PrincipalPropietario;