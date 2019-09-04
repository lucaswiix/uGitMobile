import React, { useEffect, useState } from 'react';

import { View, ActivityIndicator, Text, FlatList,  TouchableOpacity, Modal } from 'react-native';
import api from 'services/api';
import AsyncStorage from '@react-native-community/async-storage';

import { SafeAreaView } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

import { Icon, ListItem, Overlay } from 'react-native-elements'; 
import styles from './styles';

export default function Dashboard({ navigation }) {

    const [project, setProject] = useState({
        loading: false,
        data: null,
      });

      const [projects, setProjects] = useState([]);
    const [token, setToken] = useState('');
    const [commits, setCommits] = useState([]);
    const [modalStatus, setModalStatus] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        async function fetchData() {
            setLoading(true);                
            const storageToken = await AsyncStorage.getItem('token');
            if(!storageToken){
                await AsyncStorage.removeItem('token');
                navigation.navigate('Auth') ;
            }
            
            setToken(storageToken);
            var response = {};
            await api.get('/api/v4/projects?membership=true&order_by=last_activity_at', { headers: {
                Authorization: ` Bearer ${storageToken}` 
            }, timeout: 5000} ).then(r => {
                response = r.data[0];
                setProject(r.data[0]);
                let mapProject = r.data.map(p => {
                    if(p.avatar_url == null) p.avatar_url = 'http://10.0.30.9/uploads/-/system/project/avatar/47/icone.png';
                    else p.avatar_url = p.avatar_url.replace('gitlab.usto.re', '10.0.30.9');
                });
                console.log(mapProject);
                setProjects(r.data);
            }).catch(async e => {
                console.log('error', e);
                if(e.hasOwnProperty('response') && e.response.status == 401){
                    await AsyncStorage.removeItem('token');
                    navigation.navigate('Auth');       
                }
            });
            
            await api.get(`/api/v4/projects/${response.id}/repository/commits`, { headers: {
                Authorization: ` Bearer ${storageToken}` 
            }, timeout: 5000 } ).then(r => {
                setCommits(r.data);
            }).catch(e => console.log(e));

            setLoading(false)
        }

        fetchData();


    }, []);    

    async function fSetProject(project){
        setLoading(true)        
        setModalStatus(false);
        await api.get(`/api/v4/projects/${project.id}/repository/commits`, { headers: {
            Authorization: ` Bearer ${token}` 
        }, timeout: 5000 } ).then(r => {
            setProject(project);
            setCommits(r.data);
            
        }).catch(e => console.log(e));
        setLoading(false)
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
            onPress={()=>fSetProject(p)}
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

            {!loading && commits.length > 0 ? (
                <View >

                <View style={{margin: 20, flexDirection:'row', justifyContent: 'space-between'}}>
                <View>
                 <Text style={{fontWeight:'bold', fontSize:24, color:'#393939'}}>Last commits / <Text style={{color:'#717171', fontSize: 16}}>{project.name}</Text></Text>
                </View>

                 <View>
                 <TouchableOpacity onPress={() => setModalStatus(true)}>
                     <Icon type="font-awesome" name="cog" color="#000"/>
                 </TouchableOpacity>
                 </View>
                </View>
                

                

                <FlatList
                data={commits}
                renderItem={({item, index, separators}) => <ListItem
                title={item.title}
                subtitle={item.author_name}
              />
            }
                keyExtractor={item => item.id}
                />
            

            </View>

        ) : (
            <View style={styles.loadingView}>
                <ActivityIndicator style={styles.loadingIndicator} size="large" color="#000" />
                <Text style={styles.loadingText}>Getting commits...</Text>
            </View>
        )}

    </SafeAreaView>

  );
  
}
