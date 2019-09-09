import React, { useEffect, useState } from 'react';

import { View, ActivityIndicator, Text, FlatList,  TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import api from 'services/api';
import AsyncStorage from '@react-native-community/async-storage';

import { SafeAreaView } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

import { Icon, ListItem, Overlay } from 'react-native-elements'; 
import styles from './styles';

export default function Dashboard({ navigation }) {

    const [project, setProject] = useState(null);

      const [projects, setProjects] = useState([]);

    const [token, setToken] = useState('');

    const [mergeRequests, setMergeRequests] = useState([]);

    const [modalStatus, setModalStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function fetchData() {
            setLoading(true);                
            const storageToken = await AsyncStorage.getItem('token');
            if(!storageToken){
                await AsyncStorage.removeItem('token');
                return navigation.navigate('Auth') ;
            }
            
            setToken(storageToken);
            var response = {};
            await api.get('/api/v4/projects?membership=true&order_by=last_activity_at', { 
                cancelToken: source.token,
                headers: {
                Authorization: ` Bearer ${storageToken}` 
            }, timeout: 5000} ).then(r => {
                response = r.data[0];
                console.log('Projects ', r.data);
                setProject(r.data[0]);
                setProjects(r.data);
            }).catch(async e => {
                console.log('error', e);
                if(e.hasOwnProperty('response') && e.response.status == 401){
                    await AsyncStorage.removeItem('token');
                    return navigation.navigate('Auth');       
                }
            });
            
            await api.get(`/api/v4/projects/${response.id}/merge_requests?state=opened&order_by=created_at`, { headers: {
                Authorization: ` Bearer ${storageToken}` 
            }, timeout: 5000 } ).then(r => {
                console.log('merge requests: ', r.data);
                if(r.data.length < 1) setEmpty(true);
              setMergeRequests(r.data);
            }).catch(e => console.log(e));
            

            setLoading(false)
        }

        fetchData();
        
        return () => {
            source.cancel();
        };


    }, []);    

    async function fSetProject(project){
        setEmpty(false);
        setLoading(true)        
        setModalStatus(false);
        await api.get(`/api/v4/projects/${project.id}/merge_requests?state=opened&order_by=created_at`, { headers: {
            Authorization: ` Bearer ${token}` 
        }, timeout: 5000 } ).then(r => {
            setProject(project);
            if(r.data.length < 1) setEmpty(true);
            setMergeRequests(r.data);            
        }).catch(e => console.log(e));
        setLoading(false)
    }

    async function refreshMrs(){
        setEmpty(false);
        setRefreshing(true);
        await api.get(`/api/v4/projects/${project.id}/merge_requests?state=opened&order_by=created_at`, { headers: {
            Authorization: ` Bearer ${token}` 
        }, timeout: 5000 } ).then(r => {
            setProject(project);
            if(r.data.length < 1) setEmpty(true);
            setMergeRequests(r.data);            
        }).catch(e => console.log(e));
        setRefreshing(false);
    }

    return (
    <SafeAreaView>

        <Overlay 
        isVisible={modalStatus}
        onBackdropPress={() => setModalStatus(false)}
        >
            <View style={{flex:1}}>

            <View style={{margin:20, alignSelf: 'stretch', flexDirection:'row', justifyContent: 'space-between'}}>
                <View>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>Select project</Text>
                </View>
                <View>
                <TouchableOpacity onPress={() => setModalStatus(false)}>
                     <Icon type="font-awesome" name="times" color="#000"/>
                 </TouchableOpacity>
                </View>
            </View>

             <ScrollView style={{flex:1, alignSelf: 'stretch'}}>

            {projects.length > 0 && (
              projects.map((p, i) => (
                    <View key={i} style={{borderWidth: 1, borderColor: "#ccc"}}>
                    <ListItem
            key={i}
            title={p.name}
            onPress={() => fSetProject(p)}
            rightIcon={project.id == p.id ? <Icon
              name='check'
              type='font-awesome'
              color='#006621'
              /> : {} }
              />
            </View>
                ))
                )
              }

                <TouchableOpacity style={{alignItems:'center'}} onPress={() => setModalStatus(false)}>
                    <Text style={{fontWeight:'bold', color:'#000'}}>Close</Text>
                </TouchableOpacity>
            </ScrollView>

            </View>
        </Overlay >

              {project && projects.length > 0 && (
                <View style={{margin: 20, flexDirection:'row', justifyContent: 'space-between'}}>
                <View>
                 <Text style={{fontWeight:'bold', fontSize:24, color:'#393939'}}>Merge requests / <Text style={{color:'#717171', fontSize: 16}}>{project.name}</Text></Text>
                </View>

                 <View>
                 <TouchableOpacity onPress={() => setModalStatus(true)}>
                     <Icon type="font-awesome" name="cog" color="#000"/>
                 </TouchableOpacity>
                 </View>
                </View>
              )}

            {!loading && mergeRequests.length > 0 && (
                <View >

                <FlatList
                data={mergeRequests}                
                keyExtractor={item => item.id.toString()}
                refreshing={refreshing}
                onRefresh={refreshMrs}
                renderItem={({item, index, separators}) => <ListItem
                leftAvatar={{ source: { uri: item.author.avatar_url.replace('gitlab.usto.re', '10.0.30.9') } }}
                onPress={() => navigation.navigate('details', { token: token, project: project, data: item })}                
                title={item.title}
                subtitle={item.source_branch+' -> '+item.target_branch}
              />
            }
                />

            </View>

        )}

        {loading && (
            <View style={styles.loadingView}>
                <ActivityIndicator style={styles.loadingIndicator} size="large" color="#000" />
                <Text style={styles.loadingText}>Getting merge requests...</Text>
            </View>
        )}

        {empty && (
            <View style={styles.loadingView}>
            <Text style={styles.loadingText}>No merge requests found on this project.</Text>
        </View>
        )}

    </SafeAreaView>

  );
  
}
