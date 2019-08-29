import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import  { 
    ActivityIndicator,
    View, 
    Text, 
    SafeAreaView,
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput } from 'react-native';

import { CheckBox } from 'react-native-elements';

import logo from '../assets/logo.png';
import api from '../services/api';
import { ScrollView } from 'react-native-gesture-handler';

export default function Main({ navigation }) {
    const token = navigation.getParam('token');
    const [loading, setLoading] = useState(true);
    const [milestone, setMilestone] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [invalidStone, setInvalidStone] = useState(false);

    useEffect(() => {
        async function loadProjects() {
            setLoading(true);
            if(token) console.log('token', token);
            await api.get(`/api/v4/groups/35?access_token=${token}`, { timeout : 2000}).then(response => {
                setProjects(response.data.projects.sort((a,b) =>  a.name - b.name ? 1 : -1));
                console.log(response.data.projects);
            }).catch(error => {
                if(error.response){
                    if(error.response.status == 401)
                    {
                        AsyncStorage.removeItem('token');
                        navigation.navigate('Auth');
                    }
                }
                AsyncStorage.removeItem('token');
                navigation.navigate('Auth');
                
            });
            setLoading(false);           
        }
        try {        
            loadProjects();            
        } catch (error) {
            console.log('Some error happended');
        }

    }, [token]);

    async function selectedProject(project_id){

        if(selectedProjects.includes(project_id)){
            return setSelectedProjects(selectedProjects.filter(r => r != project_id));
        }else if(!selectedProjects.includes(project_id) && selectedProjects.length < 3){
            return setSelectedProjects([ ...selectedProjects, project_id]);
        }
    
    }

    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    async function handleGo(){

        if((milestone != null 
            && milestone.length > 3) && (selectedProjects.length > 0 && selectedProjects.length < 4)){
            let data = {
                token,
                milestone,
                projects: selectedProjects
            };
            navigation.navigate('Points', { data });
        }else
            setInvalidStone(true);
    }

    return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleLogout}>
            <Image style={styles.logo} source={logo}/>
        </TouchableOpacity>

        <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter a milestone name" 
                placeholderTextColor="#999"
                style={[styles.input, invalidStone && styles.textinvalid ]}
                value={milestone}
                onChangeText={setMilestone}
                 />

        <ScrollView style={{flex:1, alignSelf: 'stretch',}}>

        {!loading && projects.length == 0 ? (
            <Text style={styles.endText}>Acabou :(</Text>            
        ) : (
            projects.map((p, index) => (
                <View key={p.id} style={styles.viewCheckBoxed}>       
                            <CheckBox                                
                                containerStyle={{flex:1,alignSelf: 'stretch',}}
                                checked={selectedProjects.includes(p.id)}                       
                                title={p.name}
                                onPress={() => selectedProject(p.id)}
                            />                
                </View >
                  
            ))
        )}
        {loading && (
            <View style={styles.loadingView}>
                <ActivityIndicator style={{marginTop:20}} size="large" color="#000" />
                <Text style={{color:'#000'}}>Loading projects...</Text>
            </View>
        )}

        </ScrollView>
        {!loading && (
            <View style={styles.footer}>

                <TouchableOpacity onPress={handleGo} style={styles.button}>
                    <Text style={styles.buttonText}>Go!</Text>
                </TouchableOpacity>

            </View>
        )}

    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    viewCheckBoxed: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex:1

    },
    textinvalid:{
        borderColor: "#ff0000"
    },
    container: {
        flex:1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    loadingView:{
        alignSelf: 'center',  
        justifyContent: 'center',
    }, 
    logo :{ 
        marginTop: 30
    },
    input: {
        height:46,
        alignSelf: 'stretch',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 20,
        paddingHorizontal: 15,
        
    },
    cardsContainer: {
        flex:1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    button: {
        padding:20,
    },
    card: {
      borderWidth:1,
      borderColor: '#ddd',
      borderRadius: 8,
      margin: 30,
      overflow: 'hidden',
      position: 'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
    },
    avatar: {
        flex:1,
        height:300
    },
    footer:{
        paddingHorizontal: 20,
        paddingVertical:15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color : '#999',
        marginTop: 5,
        lineHeight: 18
    }, 
    buttonsContainer:{
        flexDirection: 'row',
        marginBottom: 30,
    },
    button : {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    endText:{
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#999'
    },
    matchContainer:{
        ... StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    matchProfile: {
        height: 160,
        width: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },
    matchName: {
        fontWeight: 'bold',
        color:'#fff',
        fontSize:26,
        alignSelf:'center'
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color:'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
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
