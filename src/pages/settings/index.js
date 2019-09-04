import React, { Component, useEffect } from 'react';

import { Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


export default function settings({ navigation }) {
    // import { Container } from './styles';
    useEffect(()=> {
        const reset = async () => {
            await AsyncStorage.removeItem('token');
            navigation.navigate('Auth');
        }

        setTimeout(()=>{
            reset();
        }, 1000)

    }, [])

    return <Text style={{alignSelf: 'center', justifyContent: 'center', fontWeight: 'bold', flexDirection: 'column'}}>Logging out ...</Text>
 
}
