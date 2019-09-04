import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform, Text, 
    StyleSheet, Image,
     TextInput, TouchableOpacity, 
     View } from 'react-native';

import NetInfo from "@react-native-community/netinfo";

import logo from 'assets/logo.png';
import api from 'services/api';

import axios from 'axios';
export default function Login({ navigation }) {  
    const [email, setEmail] = useState('');

    const [toggleLan, setToggleLan] = useState(false);
    const [lanList, setLanList] = useState({});
    const [loadedLanInfo, setLoadedLanInfo] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('token').then(token => {
            if(token) {
                navigation.navigate('App', { token });
            }
        });

    }, []);


    async function handleShowNetwork(){
        var data = {};
        setToggleLan(true);
        setLoadedLanInfo(false);

        setLanList({});
            await NetInfo.fetch().then(state => {
                data.type = state.type;
                data.isConnected = state.isConnected;
            }).catch(e => console.log(e));

            try {
                const responseUcloud = await fetch('http://api.exchangeratesapi.io/latest', 
                { timeout: 5000 });
                const rspk = await responseUcloud.json();
                if(rspk)
                data.pingGoogle = true;
            } catch (error) {                
                data.pingGoogle = false;           
            }

            try {                
                const gitlabApi = await fetch('http://10.0.30.9/api/v4/projects');
                const responseGitlab = await gitlabApi.json();
                if(responseGitlab) 
                data.pingGitlab = true;
            } catch (error) {                
                data.pingGitlab = false;
            }
            
            setLanList({type: data.type, isConnected: data.isConnected, pingGoogle: data.pingGoogle, pingGitlab : data.pingGitlab});
            setLoadedLanInfo(true);
    }

    async function handleLogin() {
        setErrorMsg('');

        setLoading(true);
        let data = {
            "grant_type"    : "password",
            "username"      : email,
            "password"      : password
          }
        await fetch('http://10.0.30.9/oauth/token', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then((r) => r.json())
          .then(async (response) => {
              console.log(response);
            await AsyncStorage.setItem('token', response.access_token);
            // console.log(navigation.dangerouslyGetParent());
            navigation.navigate('App', { token: response.access_token });
        
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
                setErrorMsg('Failed in try contact to gitlab:\n '+error.toString());
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

                    {toggleLan && (
                        <View style={styles.lanContainer}>
                
                            <Image style={styles.matchImage} source={logo} alt="Lans" />
                            {loadedLanInfo ? (

                            <View style={{marginVertical: 20}}>
                                <Text style={{color: '#ddd', fontWeight: 'bold'}}>Connection Type: {lanList.type}</Text>
                                <Text style={{color: '#ddd', fontWeight: 'bold'}}>Is connected? {lanList.isConnected ? 'Yes' : 'No'}</Text>
                                <Text style={{color: '#ddd', fontWeight: 'bold'}}>Ping in google.com: {lanList.pingGoogle ? 'Success' : 'Failed'}</Text>
                                <Text style={{color: '#ddd', fontWeight: 'bold'}}>Ping in 10.0.30.9: {lanList.pingGitlab ? 'Success' : 'Failed'}</Text>

                            </View>
                            ) : <ActivityIndicator style={{marginTop:20}} size="large" color="#fff" />}
   
                            <TouchableOpacity onPress={() => setToggleLan(false)} style={styles.matchCloseBtn}>
                                 <Text style={styles.closeMatch}>Close</Text>    
                            </TouchableOpacity>
                   
                        </View>
                    )
                    }

                    <TouchableOpacity onPress={() => handleShowNetwork()} style={styles.BtnShowLan}>
                         <Text style={styles.btnToggleNetwork}>Show Network</Text>    
                     </TouchableOpacity>

                
            </KeyboardAvoidingView>
        );    
}

const styles = StyleSheet.create({
    BtnShowLan:{
        position: "absolute",
        bottom: 0,
        alignSelf: 'center',
        marginBottom: 10,
    },
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
    lanContainer:{
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
    btnToggleNetwork: {
        fontSize: 16,      
        color: 'rgba(0, 0, 0, 0.8)',
        marginTop: 30,
        textAlign: 'center',
        fontWeight:'bold'
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain'
    }
});
