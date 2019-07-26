import React , {Component} from 'react';
import {Text,View, StyleSheet} from 'react-native';
import {Button, Card, CardSection, Header,Field,ButtonCancelar} from '../../Common';
import {Database} from '../../Firebase';
import RNPickerSelect from 'react-native-picker-select';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
class IngresoManual extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Ingreso Manual',
            headerLeft: (
                <Icon
                  style={{ paddingLeft: 10 }}
                  onPress={() => navigation.goBack()}
                  name="arrow-back"
                  size={30}
                />
              ),
        }}

    state= {picker: '', tiposDocumento: [], cantidad: 0 }

    obtenerPickers= () => {
        var dbRef = Database.collection('TipoDocumento')
        var dbDocs = dbRef.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.state.tiposDocumento.push({ value: doc.id, label: doc.data().Nombre })
                })
                this.setState({cantidad: this.state.tiposDocumento.length})
            })
            .catch(err => {
            })
    }

    render() {
        if (this.state.tiposDocumento.length < 3) {
            this.obtenerPickers()
        }
      return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.logueo}> Ud. se ha logueado como : Encargado </Text> 
                <Header headerText="Registrar nuevo ingreso"> </Header> 
                <Card>
                    <View style= {styles.picker}>
                    <RNPickerSelect
                        selectedValue= {this.state.picker}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({picker: itemValue})
                          }
                        items = {this.state.tiposDocumento} >
                    </RNPickerSelect>
                    </View>

                    <CardSection>
                        <Field
                            placeholder="Eg. 32645187"
                            label="Número de documento"
                            hidden={false}
                        />
                    </CardSection>
                    <View style={styles.botones}>
                        <CardSection>
                            <Button>Aceptar</Button>
                        </CardSection>
                        <CardSection>
                            <ButtonCancelar  onPress= {() => {this.props.navigation.goBack()}}>Cancelar</ButtonCancelar>
                        </CardSection>
                    </View>
                </Card> 
            </View>
            </ScrollView>
      );
    }
  }
  const styles= StyleSheet.create({
    container: {
        padding:5
    },
    botones: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        justifyContent: 'flex-start',
        padding:10
    },
    logueo: {
        textAlign: 'right',
        color: '#000000',
        paddingTop: 10,
    },
    picker: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'column',
        borderColor: '#ddd',
        position: 'relative',
        marginTop:5,
        paddingLeft:16
    }
});

export default IngresoManual;