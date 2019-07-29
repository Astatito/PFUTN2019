import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ButtonCancelar = ({ onPress, children }) => {
    const { buttonStyle, textStyle } = styles;

    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
    );
};

const styles = {
    textStyle: {
        alignSelf: 'center',
        color: '#DA2222',
        fontSize: 17,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DA2222',
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center'
    }
};

export { ButtonCancelar };
