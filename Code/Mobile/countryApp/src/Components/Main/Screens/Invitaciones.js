import React, { Component } from 'react';
import { FlatList, Alert } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../Storage';
import { Database } from '../../Firebase';
import moment from 'moment';

var flatListData = [
    {
        key: 'wulefb43oy',
        nombre: 'Alexis',
        apellido: 'Pagura',
        documento: '39.645.758',
        fechaDesde: '02/11/2018 20:00 hs',
        fechaHasta: '02/11/2018 23:00 hs'
    },
    {
        key: 'kqedufhkdu',
        nombre: 'Fabián',
        apellido: 'Guidobaldi',
        documento: '40.875.659',
        fechaDesde: '02/11/2018 20:00 hs',
        fechaHasta: '02/11/2018 23:00 hs'
    },
    {
        key: '237r8h2eff',
        nombre: 'Eze',
        apellido: 'Braicovich',
        documento: '39.645.569 ',
        fechaDesde: '02/11/2018 20:00 hs',
        fechaHasta: '02/11/2018 23:00 hs'
    },
    { key: '32fh8hfhfh', documento: '39.645.100 ', fechaDesde: '02/11/2018 20:00 hs', fechaHasta: '02/11/2018 23:00 hs' },
    { key: '32h7fhf23h', documento: '39.448.569 ', fechaDesde: '02/11/2018 20:00 hs', fechaHasta: '02/11/2018 23:00 hs' },
    { key: 'ewufih8o72', documento: '39.298.671 ', fechaDesde: '02/11/2018 20:00 hs', fechaHasta: '02/11/2018 23:00 hs' }
];

class FlatListItem extends Component {
    state = { activeRowKey: null };

    render() {
        const swipeOutSettings = {
            autoClose: true,
            style: { backgroundColor: '#fff' },
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.item.key });
            },
            right: [
                {
                    text: 'Eliminar',
                    type: 'delete',
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Atención',
                            'Está seguro que desea eliminar ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        flatListData.splice(this.props.index, 1);
                                        //Refresh FlatList
                                        this.props.parentFlatList.refreshFlatList(deletingRow);
                                    }
                                }
                            ],
                            { cancelable: true }
                        );
                    }
                }
            ],
            rowId: this.props.index,
            sectionId: 1
        };
        if (this.props.item.nombre == null && this.props.item.apellido == null) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail
                                source={{
                                    uri:
                                        'data:image/jpeg;base64,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'
                                }}
                            />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text></Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center', marginTop: '3.4%' }}>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
        } else {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail
                                source={{
                                    uri:
                                        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTExIVFhUXFxcXFxcXFxUVFxcVFRcWFxUVFxUYHSggHR4lHRUVITEiJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi8lHyYtLS0tLS0rLS0tKy0uLS0yLS0tLS0uLS0tLS0tLS0tLS0vLS0vKy0tKy8tLS0tLS0tLf/AABEIAOAA4QMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABQECAwYHBAj/xABBEAACAQICBwQFCwMEAgMAAAAAAQIDEQQhBQYSMUFRcWGBkaETIrHB0QcjMkJSYnKCkuHwQ1OyJGOiwjNzFBUW/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAEDBAIFBv/EACoRAAICAQMDAwQCAwAAAAAAAAABAgMRBBIhMUFRBRMiYZGx8BQyI6HR/9oADAMBAAIRAxEAPwDuIAABSMrlkpF0AC4AAAAAAAtbALgWW7RKqkrtpdXb2gF4PFU0vQjvqw7nf2GGWsGGX9T/AIz+BU7611kvuicMkwRa1gw39z/jP4Ganpeg91WPe9n2hX1vpJfdDDPcC2nUjJXi012NP2FxaQCkZXzLJSL47gCoAAAAAABa2AXAsLkwCoAABjlIvki2MQBGJeAAAAAACB0prHGF40rSl9r6q+JXbbCtZkyUsk3WrRgtqUlFc27IgsXrLCOVOLnnvfqx+JrWKxU6j2pycn27l0W5GJM8m31GUuIcfksUPJMYjTNWau5OEeUcm+/f5kRUm5O7z6tvzZRs8eNxyp5WvLly6mKy2VnV5Lq6pTe2K5PWCCxGlJySS9XnZ7/gYqWPqR+s31z9pxtN0fTbXHLwn4NiBCLTE/sx8/iZoaZ5w8H+xGGVy0F67f7JaEmndNp81kySwmmq8f6m0uU8/Pf5kPh8RGorxfVcV1M83fgd12Shyngxzg08SRtGC1lpt2qRce1Zx8N6J2jWjNbUZKS5p3OcGbC4mdN7UJOL7OPVbmbqvUZx4ms/krcF2OiggNF6xxnaNW0Zfa+q+vL2E+merVdC1ZiytrAABaQCyJeUaALS5IJFQAAAAAAAAAAY69aMIuUmklvbK160YRcpOySu2aRpjSkq8uKgvox977f51zanUxpj9eyOoxyZtMablWvGN40+XGXXs7CJBQ8CyyVkt0nyXJYAAKyTz47FKnG/F7l2/A12U23dvNnp0jilUldbkrLt7TynaR9DotP7UMtcvqVaKBMqyTYUCQSDYBdGbTunZ8LE7g9IRnk8pcufRkAVi7MYT6mTV6ZWw46rp/w2oERhce45PNeaJSjVjJXTv/OJEoOJ84ZCV0PpuVG0ZXlT5cY/h+BElRXZKuW6L5DWTo1CtGcVKLTT3NGQ0TRGk5UJc4P6Ufeu32m74etGcVKLunmme/ptSro/XuimUcGQAGo5AAAAAAAAAABBa0aR2Ieji/Wms+yP77vErttVcHJkpZInWHSvpZbEX83F/qfPpyIgFD5uyyVknKRelgqUBUrJKGPEVNmMpck/2Mh4tML5vfbNd/YEWUwU7IxfdkAbtq9oKNOKqVIp1HnZq6gnuVufaaxoLDekr04vde76R9b3W7zopt08E/kz2tba1iCPPPA0nvpU31hF+4xPRGH/ALNP9KR7Qatq8Hn75LozwPQmG/sx8yn/ANHhv7MfP4kgCNkfBPuT8v7muaV1XpuLdG8ZLPZu3GXZnmmae0dTND1pwqp4iVt00p97un5pvvM19aS3I36O+UnskyPjuMlOo4u6dmY6ayLguUeFakrJJeWSmG0gnlLJ8+H7HvRrh6MNjJQ7Vyfu5FUqu6OEybJbV/SvoZbMn83J5/df2viQeHxMZ7nny4mYrhOVclJdUS1k6UgQOq2kduPopP1or1e2P7fAnj6Sm1WwUkUNYYABYQAAAAC2TAKVqijFybskm30Rz7G4l1Zym+L3clwXgbLrVitmmoK95vP8Md/nY1Ro8b1G3MlBdi2C7lAAeYWAAAFSN02/UWf1t3PJ/EkTw6QwzqzpQW+Ta7ErJt91iYrLNOjx70c/vBk1KpXrTl9mFv1NfBm5JkHoPRX/AMerOO05XhF3tbdJq1s/4ycR6dUXGGGatTYp2ZXQAAsKAAAAaXrp/wCeP/rX+UjdDXtL6IeIxDtJLZpw3pu7bna/gVXRco4Ro001Ce5mp0nkXmSdF05OE4pNNp25rK64Fko2KYrCMGq2+9Lb0KAAkzhO2aJDC6R4T8fiiPBzKKl1JNnwWLcJxqRd7O/VcV3q6Oh0KqnFSjmmk10ZxqhiJQeT7uB0HUjSqq05U3lKGdvuyvu77+KNWgk4TcH0f5OJ88mzspF3LJSuXx3HrFZUAAAtRcW1Gkm3wz8ADUNYK+3Vlf6MPVXa1v8ANvwIaT7i6tVcm5Pi2+9u7LD5i6zfJs0JYAAKiQAAAZsC16Wne30ms/wS3dphLa7k3GUbbUZRkuF9l5rwujutpNNndeNyybK4eun92S8429/iZTwYrFxtRqJ+rKoo904yjn+a3ge89RPJqawkAASQAAADFh/pTl2peEV72zKyH0fpBRwzrS4yqSXbepLZj7CM4ZOPi3+/vBCaXadWpKSy25KMb787N+REylcrVquTbe9lpQ3kwzluk2AAcnIAAAJzU7E+jxMM8p3g/wA30bfmUSDRl9O1JTjk01JfiTvfyO4S2tSIZ2aMS4spVFKKktzSa6NXRee2VAAAA8ml57NCo/uS81Y9ZHawv/T1Oi/yRXc8Vyf0ZK6migA+XNBUoCoBQqAAUAAB5dK7XonZtJNStfK6aztzNo0XjFWpRqLe163ZJZSXia5iobUJJcYvxtkQODx9Wlf0c5RvvS3PqnkaKbdnU9PS1+9S455T/J0mrVjFOUmklvbyRBQ1opym4qLtwbdm+1L3M1Wvi61dqMpym20ku15K0Vlc98NWcS1nGK6yj7rl/vSk/ijR/FhBf5Jck5/+opqajJWjxknfZ6/sTsZJpNNNPNNZprmaNLVjEr6sX2KS9556ePxOGbp7Uo23xdpJXzyvfyHvST+S4IelhNYrlybhrFi/R4ebvnJbEessn4K77jSFVk4xi5NpblfJXzdkUxukKtZr0k3K25ZJLolkUSOd++WUZtZX7VUYPq3kqACTywAAAAAAAADrerVXawtB/wC3FfpWz7iSITUuV8HS/OvCpImz263mCf0RU+oAB2QCO1hX+nqdF/kiRPJpaG1RqL7kvJXK7lmuS+jJXU5+AD5c0AqgAAygKgFAAACA0rh9id1ulmuvFfzmT558dhXUg8t3Hk+F/M7ri5SwjXo7vbtXh9TXYTaaadmndNb01uZO0daq8VaShJ82mn32diDcbb9/ItO1KUeh7064WdVk2CetlZqyjTT52k/Jsgq9eU5OU23J72ywrv6+0SnKXViFUIf1RWmszOZZUNmEb72237kYi+MNq5PA19vuXPwuAACTECqKAAqygAAAAB1LUuNsHS/O/GpJk2RurdLZwtBf7cX+pbXvJI9utYgl9EVPqAAdkApKN00+JUAHNqtNxk4vem0+qdi0l9P4fYrylwlaS68e+6uRMmfMW1+3Jxfk0J5BQAqJAAAAKTmoq7aS5t2XiyOq6fw0Wl6VSk9ygnPvusvM7hVOf9U2Q5JdSSJXQiym+i9vxNc0TpmlXxNPDNTh6S6jNxjZtJuys73djo+HwMIwUEsl43fG5v0+ht3bpLBEbYp5NQ03q7Gr69O0Z8V9WXhuZq+K0TWpu0oNcndNPozpmIw7j2rn8Tz1IKSs0muTOrNOnLnhnrU6yUY4XKOarBVPsvyPXhNHtO8rZcPibRjNDcab/K/c/ieXAaKq1ZbKja30pSVkvi+wmvTQzxyTZrZuPOEQ2kty6nhOpYfQVGNOVNx2tpWk3vfR8M81bkcw1vnSwWJ9Bec7wjNZK62nJKLzzfq370XW6WbeVyePO2LeSxIIxYfSVG13NLqna27fua337jJ6VSzi00+TT80ZZVyj/ZEKSfQqADgkAAAMupU3KSit8morq3Ze0tJ3U/BbeKhdX2L1H2bP0e/acTuEd0kg3g6bSpqMVFbkkl0Ssi8ssXJntlJUAAAxylcvkikY8wCC1pwjlSU1vi8/wv8AexqZ0irTUouLV000+jOfY3CulUlB8H4rg/A8b1KrElNdy2t9jAADzCwxYnEQpxc5yUYre3/PI0zS2uc5XjQjsr7cknJ9qjuXffuI7WnTLxFRqL+ag7RXCT3Ob68OzqyFPf0fp0YxU7Vl+PBksubeImXFYqpUd6k5Tf3m34cu4yQquLhUWdkk+tmrPu3dDzF1ObXvT3Ndp6iSSwigmqeO2djEPJwltU4p57cWmm31R3zQmkYYmhTrw3VIqXR/Wi+1O67j5pqVG+7JJbkuSOnfIzp6zngpvfepS6/1ILykl+M5kuDuL5OrNHhxGD4x8Pge4iNYNI+jjsRfryX6Y8+r+Jlv2KDcjTVKSfxM2Gwl83kvNkhGKSsiB1b0jdeik819B9nGPwJ850zhKG6JNspN8lJSsrs+f9atJxxGNr1bq21sq9mnCmtlW6tXtvafj1X5SdPrCYRqLtVq+pTtvX2p/lWfWy4nCsRXc3fpfm3zZrgu5mm+xSrUvkr2XPe+F33eBbSqyi7xk4vmm17C0FmCsmsDrDOOVRbS5rKS9z8jYsPXjUipRd0/5Zmhnt0Tj3Rnf6rykuzn1Rh1GjjJZgsP8lsLWuGboCidyp45qKHQ9QcDs05VnvqNJfhjk33y2vBGjaNwUq1WFKO+Ttfkt7l3K7OvYfDRhCMIqyilFdErI26OGZbvBzJl5ckEip6JWAAAAAACD1o0dtw9JFetBZ9sf23+JOArtqVkHFkp4OakPrXjfRYabTtKXqR6y3/8VJ9xt+sOivRS24r5uT/S+XTkc2+UKvf0NP8AFN9u6Mf+x4mn07/kquXZ/jksnL4No00qkEijZ9OYQ2AAQDPgcXOjUhVpvZnCSlF9q59nBrimzAAD6Q0Fp6GKwscRT+ss4XzjUX0qb7+PJpmr4mrKcnKX0m8/gc91F1leDrbM38xUaU/uy3RqJdm59nRHS9KqO3ePFJ5bnfiu6x5XqNb2p54Nmnlk8cJNNNOzWafJo3WjjkqPparUFGO1UbyUUldtmq6KpKVRX4K67Wv55GjfKJrZ6eTw1GXzMX85JPKpOLyS+7FrvefBX59OreHLsdXySITXPWKWOxMquapr1aUX9WC4v70t78OBBgHrmIAAEF2/r7f3LQXb+vtBJteruI26KT3wez3b15O3cShreqtS05x5xTS/C7f9jouqOgXiKm3NfNQef35fY6c/Djl4moqfvuMe5rrl8eTYdRNDejh6ea9eovVvwp77/myfRI2sIHoVwUI7UQ3kAA7IAAAAAAAAALK1KM4uMldNWaOH/KtoKrQrxqtN0HFQhPlK8m4z5PPvtlxt3MwY7B061OVKrBThJWlGSumiFGO5TxyiJLKwfLTd+vtLTd9evk9q4NyrUb1MNvfGdJcprjH73jbe9J39faaE8mdrBQAEkAAAA2/VDWHZtQrS9XdTk3u5Qb5cuW7pqKRRsquqjbDbI7hNxeUbvrbrI47VCjK0rONSS4J5OEXz5+G/do5Urv6+0U0xqhtQnNzeWUABacAAAAqsv55hZG4aj6h1sc1VqXp4bft/WqdlJPh955cr52N4JSyW/Jzq/VxmJ2kmqULqrU4Zq6hHnN5dFm+CfesLhoU4RhCKjGKskjFo3R9LD040qMFCEVZRXm3zb3tvNnqM7SctxoisLAAAJAAAAAAABa2AXAsUe4uiwCoAABzvXD5L6Nfaq4Rxo1XduH9Kb6L6D7UrdnE6ICU8ENJ9T5g0zojEYWfo8RSlTlwuspW4xkspdzPAfU2OwVKtB06tONSD3xnFST7mc+098kmHneWFqyovfsSvUp9E29qPi+hYpruVOt9jjUVfJFXGzs/4zccXqDjsMnKVF1LXe1R+dy+7DKV+Occ1kaljbqbUouL+zJOLVsvovNLsOk8nDWDE2ACSAAAA2CtOLk1GKbk90Urt9EszadD6iaQrJOOHcL7pVvm4x7XGXrN8rRYySuTVT2aK0ZWxNT0dClKrPlFZLtk3lFdraR1nQnyU0454ut6V/YglThftn9OXX1TftGaPo0IKnRpQpwX1YJRV+btvfazhzXY7Vb7mgao/JZTpNVca41Z71SWdKL+839N9mS7HvOkxikrLJFQVt5LUkugABBIALZSsAJuxVGNK5lAAAABai4o0AUKpBIqAAAAAAAGY3K5fJFIxAEYmPFYSnUWzUpwmuUoqS8GjMADXsRqNo2e/B0V+CPo/8LEfP5MdFv8AoSXStW98zcQTlkbV4NNh8mGi1/Qk+tat7pnvw+omjYbsHSf406n+bZsYGWNq8HnwmCpUlalThTXKEYxXgkZUXlGiCS0uSCRUAAAAAAApKVjGsy+UblUgAkVAAAAAP//Z'
                                }}
                            />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center', marginTop: '2.6%' }}>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
        }
    }
}

export default class BasicFlatList extends Component {
    static navigationOptions = {
        title: 'Invitaciones'
    };

    constructor(props) {
        super(props);
        state = { deletedRowKey: null };
    }

    componentWillMount() {
        console.log('FlatListData:', flatListData);
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
                console.log(this.state.usuario);
                this.obtenerInvitaciones();
            })
            .catch(error => {
                switch (error.name) {
                    case 'NotFoundError':
                        console.log('La key solicitada no existe.');
                        break;
                    default:
                        console.warn('Error inesperado: ', error.message);
                }
            });
    }

    obtenerInvitaciones = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refInvitados = refCountry.collection('Invitados');

        refInvitados
            .where(
                'IdPropietario',
                '==',
                Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos)
            )
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    //El propietario tiene invitaciones
                    var tempArray = [];
                    for (var i = 0; i < snapshot.docs.length; i++) {
                        var invitado = {
                            key: snapshot.docs[i].id,
                            nombre: snapshot.docs[i].data().Nombre,
                            apellido: snapshot.docs[i].data().Apellido,
                            documento: snapshot.docs[i].data().Documento,
                            fechaDesde: moment.unix(snapshot.docs[i].data().FechaDesde.seconds).format('D/M/YYYY HH:mm'),
                            fechaHasta: moment.unix(snapshot.docs[i].data().FechaHasta.seconds).format('D/M/YYYY HH:mm')
                        };
                        tempArray.push(invitado);
                    }
                    console.log('tempArray:', tempArray);
                }
            });
    };

    refreshFlatList = deletedKey => {
        this.setState(prevState => {
            return {
                deletedRowKey: deletedKey
            };
        });
    };
    render() {
        return (
            <FlatList
                data={flatListData}
                renderItem={({ item, index }) => {
                    return <FlatListItem item={item} index={index} parentFlatList={this}></FlatListItem>;
                }}></FlatList>
        );
    }
}
