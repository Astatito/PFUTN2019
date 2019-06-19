import React, {Component} from 'react';
import {Text, View,} from 'react-native';
import firebase from 'firebase'; 
import { Field, Header, Card, CardSection, Button } from './Common';

class App extends Component {

  state = {email:'', password:'', result:''};

  componentWillMount() {
    // Inicialización de Firebase
    var firebaseConfig = {
      apiKey: "AIzaSyCuck_TCGJv5gSVrNVsRD-9r4amZ4CrwUM",
      authDomain: "countryapp-f0ce1.firebaseapp.com",
      databaseURL: "https://countryapp-f0ce1.firebaseio.com",
      projectId: "countryapp-f0ce1",
      storageBucket: "countryapp-f0ce1.appspot.com",
      messagingSenderId: "810428216960",
      appId: "1:810428216960:web:ffe81dcac50290a2"
    };
    
    firebase.initializeApp(firebaseConfig);

  }

  onButtonPress() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      this.setState({result: "Logueo exitoso."})
    })
    .catch(() => {
      this.setState({result: "Falló la autenticación."})
    })
  }

  render() {
    return (
      <View>
        <Header headerText="Welcome to CountryApp!" />
         
        <Card>
          <CardSection>
            <Field
              placeholder="ejemplo@mail.com"
              label="Email"
              value={this.state.email}
              onChangeText ={(email) => this.setState({email})}
              hidden={false}
            />
          </CardSection>
          <CardSection>
            <Field
              placeholder="password"
              label="Password"
              value={this.state.password}
              onChangeText ={(password) => this.setState({password})}
              hidden={true}
            />
          </CardSection>        
          <CardSection>
            <Button onPress={this.onButtonPress.bind(this)}>
              Log in
            </Button>
          </CardSection>
          <CardSection>
            <Text>{this.state.result}</Text>
          </CardSection>
        </Card>
      </View>
    );
  }
}

export default App;
