import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform, Text, 
    StyleSheet, Image,
     TextInput, TouchableOpacity, 
     View } from 'react-native';
import { Icon } from 'react-native-elements';

import logo from '../assets/logo.png';
import api from '../services/api';

export default function Login({ navigation }) {  
    const [email, setEmail] = useState('');

    const [accessToken, setAcessToken] = useState('');

    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('token').then(token => {
            console.log('token', token);
            if(token) {
                navigation.navigate('App', { token });
            }
        });

    }, []);


    async function handleLogin() {
        setErrorMsg('');

        setLoading(true);
        let data = {
            "grant_type"    : "password",
            "username"      : email,
            "password"      : password
          }
        await api.post('/oauth/token', data, { timeout: 2000 }).then(async response => {
            await AsyncStorage.setItem('token', response.data.access_token);
            // console.log(navigation.dangerouslyGetParent());
            navigation.navigate('App', { token: response.data.access_token });
        
        }).catch(error => {
            if(error.response){
                if(error.response.status == 401){
                    setEmail('');
                    setPassword('');
                    setErrorMsg('Invalid email or password');
                }
                else
                    setErrorMsg('Ops, some error happended in server.')
                
            }else{
                setErrorMsg('Failed in try contact to gitlab.');
            }
        

        });

        setLoading(false)
    }

        return (
            <KeyboardAvoidingView 
                behavior="padding"
                enabled={Platform.OS == "ios"}
                style={styles.container}
            >
                <Image source={logo} />
                <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="Email" 
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                 />

                 <TextInput 
                 secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Password" 
                placeholderTextColor="#999"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                 />

                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.buttonError}>{errorMsg}</Text>

                {loading && (
                     <View style={styles.matchContainer}>
                
                     <Image style={styles.matchImage} source={logo} alt="It's a match!" />

                     <ActivityIndicator style={{marginTop:20}} size="large" color="#fff" />
                        <Text>Loading...</Text>

                     <TouchableOpacity onPress={() => setLoading(false)} style={styles.matchCloseBtn}>
                         <Text style={styles.closeMatch}>Close</Text>    
                     </TouchableOpacity>
                
             </View>
                )}
            </KeyboardAvoidingView>
        );    
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    input: {
        height:46,
        alignSelf: 'stretch',
        borderRadius: 4,
        borderWidth: 1,
        marginTop:10,
        borderColor: '#ddd',
        paddingHorizontal: 15,        
    },
    button: {
        height:46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonError: {
        marginTop: 15,
        color:'#999',
        fontWeight: 'bold',
        fontSize: 16
    },
    matchContainer:{
        ... StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    matchCloseBtn: {
        alignSelf:'center',
        color:'#fff',
    },
    closeMatch: {
        fontSize: 16,      
        color:'rgba(255, 255, 255, 0.8)',
        marginTop: 30,
        textAlign: 'center',
        fontWeight:'bold'
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain'
    }
});
