import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import  { 
    ActivityIndicator,
    View, 
    Text, 
    SafeAreaView,
    Image, 
    TouchableOpacity, 
    TextInput, FlatList } from 'react-native';

import { Icon, CheckBox, Overlay, ListItem } from 'react-native-elements';

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
    const [labels, setLabels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentLabel ,setCurrentLabel] = useState('');
    const [flatRefresh, setFlatRefresh] = useState(false);
    const [closedIssues, setClosedIssues] = useState(false);

    useEffect(() => {
        async function loadProjects() {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            setStoken(token);
            await api.get(`/api/v4/projects?membership=true&order_by=last_activity_at`, { headers: { 
                "Authorization": " Bearer "+token
            }, timeout : 5000}).then(response => {
                setProjects(response.data);
            }).catch(error => {
                if(error.response){
                    if(error.response.status == 401)
                    {
                        AsyncStorage.removeItem('token');
                        navigation.navigate('Auth');
                    }
                }
                AsyncStorage.removeItem('token');
                return navigation.navigate('Auth');
                
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
        }else if(!selectedProjects.includes(project_id) && selectedProjects.length < 1){
            return setSelectedProjects([ ...selectedProjects, project_id]);
        }
    
    }

    async function handleLogout(){
        await AsyncStorage.clear();

        return navigation.navigate('Auth');
    }

    async function handleGo(){

        if((milestone != null 
            && milestone.length > 3) && (selectedProjects.length > 0 && selectedProjects.length < 4)){

                let data = {
                token:stoken,
                milestone,
                isClosed: closedIssues,
                labels,
                projects: selectedProjects
            };
            return navigation.navigate('Result', { data });
        }else
            setInvalidStone(true);
    }

    async function addCurrentLabel(){
        console.log(exists);
        let exists = -1;

        if(labels.length > 0)
            exists = labels.findIndex(l => l.toLowerCase() == currentLabel.toLowerCase());
        else
            exists = -1

        if(exists == -1 && currentLabel.length > 1) {
            if(labels.length > 0)
              setLabels([...labels, currentLabel]); 
            else
                setLabels([...labels, currentLabel]);
        }
            

        setCurrentLabel('');
    }

    async function deleteThisLabel(index){
        console.log('delete_Index', index);
        setFlatRefresh(true);
        setTimeout(() => {
            labels.splice(index, 1);
            setLabels(labels);
            setFlatRefresh(false);
        }, 500)
    }

    return (
    <SafeAreaView style={styles.container}>

        <Overlay 
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        >
            <View style={{flex:1}}>
            <Text>Labels:</Text>

            <ScrollView>

                            <CheckBox                                
                                containerStyle={{flex:1,alignSelf: 'stretch',}}
                                checked={closedIssues}                       
                                title={'Search closed issues?'}
                                onPress={() => setClosedIssues(!closedIssues)}
                            />   

                {!flatRefresh ? (
                <FlatList
                data={labels}
                refreshing={flatRefresh}
                renderItem={({item, index, separators}) => <ListItem
                title={item}
                rightIcon={{ 
                    name: 'delete', 
                    color: '#000',
                    onPress: () => deleteThisLabel(index)
                  }} 
              />
            }
                keyExtractor={item => item}
                />
                ) : (
                    <ActivityIndicator style={{marginTop:20}} size="large" color="#000" />
                )}
            </ScrollView>
                 <TextInput 
                autoCorrect={false}
                placeholder="Label Name" 
                placeholderTextColor="#999"
                style={styles.input}
                value={currentLabel}
                onChangeText={setCurrentLabel}
                 />

                <View style={{margin: 20, flexDirection:'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={addCurrentLabel} style={styles.btnAddLabel}>
                    <Text style={styles.btnAddLabelText}>Add Label</Text>
                </TouchableOpacity>
                <View style={{width:10}}></View>
                <TouchableOpacity onPress={() => setShowModal(false)} style={styles.btnSaveLabels}>
                    <Text style={styles.btnAddLabelText}>Save</Text>
                </TouchableOpacity>

                </View>


                </View>
        </Overlay>

            <View style={{margin: 20, flexDirection:'row', justifyContent: 'space-between'}}>
                <View>

                <Text style={{fontWeight:'bold', fontSize:24, color:'#393939'}}>Sprint Points</Text>
               
                </View>
                <View style={{marginHorizontal: 30, marginTop: 5}}>

            <TouchableOpacity onPress={() => setShowModal(true)}>
                     <Icon type="font-awesome" name="cog" color="#000"/>
            </TouchableOpacity>
                </View>
            </View>

        <TextInput                 
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
