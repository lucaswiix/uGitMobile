import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import  { 
    ActivityIndicator,
    View, 
    Text, 
    SafeAreaView,
    Image, 
    TouchableOpacity, 
    TextInput } from 'react-native';

import { CheckBox } from 'react-native-elements';

import logo from 'assets/logo.png';
import api from 'services/api';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

export default function Main({ navigation }) {
    const [stoken, setStoken] = useState();
    const [loading, setLoading] = useState(true);
    const [milestone, setMilestone] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [invalidStone, setInvalidStone] = useState(false);

    useEffect(() => {
        async function loadProjects() {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            setStoken(token);
            await api.get(`/api/v4/projects?membership=true&order_by=last_activity_at`, { headers: { 
                "Authorization": " Bearer "+token
            }, timeout : 5000}).then(response => {
                setProjects(response.data);
                console.log(response.data);
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
            console.log('Some error happended', error);
        }

    }, []);

    async function selectedProject(project_id){

        if(selectedProjects.includes(project_id)){
            return setSelectedProjects(selectedProjects.filter(r => r != project_id));
        }else if(!selectedProjects.includes(project_id) && selectedProjects.length < 3){
            return setSelectedProjects([ ...selectedProjects, project_id]);
        }
    
    }

    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate('Auth');
    }

    async function handleGo(){

        if((milestone != null 
            && milestone.length > 3) && (selectedProjects.length > 0 && selectedProjects.length < 4)){
            let data = {
                token:stoken,
                milestone,
                projects: selectedProjects
            };
            navigation.navigate('Result', { data });
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
