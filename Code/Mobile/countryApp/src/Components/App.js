import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Field, Header, Card, CardSection, Button } from './Common';
import Firebase from './Firebase';
class App extends Component {
    state = { email: '', password: '', result: '' };

    onButtonPress() {
        Firebase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.setState({ result: 'Logueo exitoso.' });
            })
            .catch(() => {
                this.setState({ result: 'Falló la autenticación.' });
            });
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
                            onChangeText={email => this.setState({ email })}
                            hidden={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Field
                            placeholder="password"
                            label="Password"
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                            hidden={true}
                        />
                    </CardSection>
                    <CardSection>
                        <Button onPress={this.onButtonPress.bind(this)}>Log in</Button>
                    </CardSection>
                    <CardSection>
                        <Text>{this.state.result}</Text>
                    </CardSection>
                </Card>
            </View>
        );
    }
}

// TESTING PROTECTED BRANCH

export default App;
