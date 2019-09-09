import React, { Component, useEffect, useState } from 'react';

import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { ListItem, Icon, Overlay } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

import axios from 'axios';
import api from 'services/api';
import AsyncStorage from '@react-native-community/async-storage';

export default function mergeRequests({ navigation }) {
    const [data, setData] = useState(navigation.getParam('data'));
    const [project, setProject] = useState(navigation.getParam('project'));
    const [mr, setMr] = useState({});
    const [token, setToken] = useState();
    const [loading, setLoading] = useState(true);
    const [acceptModal, setAcceptModal] = useState(false);
    const [declineModal, setDeclineModal] = useState(false);
    const [allBlackScreen, setAllBlackScreen] = useState(false);
    const [mergeRequestRes, setMergeRequestRes] = useState({method: 0, error: false, message: 'Waiting...'});
    const [loadingMr, setLoadingMr] = useState(false);

    useEffect(() => {
        setLoading(true);
        console.log('project: ', project);
        console.log('Merge request: ', data);
        authorizate();
        setMr(data);
        setLoading(false);
    }, [data]);

    async function authorizate(){
      const storageToken = await AsyncStorage.getItem('token');
            if(!storageToken){
                await AsyncStorage.removeItem('token');
                return navigation.navigate('Auth') ;
            }
            setToken(storageToken);
    }

    async function acceptMergeRequest(){
      setAcceptModal(false);
      setAllBlackScreen(true);
      setLoadingMr(true);
      await api.put(`/api/v4/projects/${project.id}/merge_requests/${mr.iid}/merge`, { 
        headers: {
        Authorization: ` Bearer ${token}` 
    }, timeout: 5000}).then(res => {
      if(res.status == 200) setMergeRequestRes({method: 0, error: false, message: 'Merged!'});

    }).catch(e => {
      console.log(e);
      setMergeRequestRes({method: 0, error: true, message: 'Failed'});
    });

    setLoadingMr(false);

    setTimeout(() => {
      return navigation.navigate('mergeRequests');
    }, 5000);

    }


    async function declineMergeRequest(){
      setDeclineModal(false);
      setAllBlackScreen(true);
      setLoadingMr(true);
      await api.delete(`/api/v4/projects/${project.id}/merge_requests/${mr.iid}`, { 
        headers: {
        Authorization: ` Bearer ${token}` 
    }, timeout: 5000}).then(res => {
      if(res.status == 200) setMergeRequestRes({method: 1, error: true, message: 'Declined!'});

    }).catch(e => {
      console.log(e);
      setMergeRequestRes({method: 1, error: true, message: 'Failed.'});
    });

    setLoadingMr(false);    
    }

    const showAlert = (method) =>{
      if(method == 0){

        Alert.alert(
          'You are sure about this?',
          'Accept this merge request?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Yes, accept!', onPress: () => acceptMergeRequest()},
          ],
        )
      }else{
        Alert.alert(
          'You are sure about this?',
          'Delete this merge request?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Yes, I\'m want delete.', onPress: () => declineMergeRequest()},
          ],
        )
      }
   }

  return (
    <SafeAreaView style={styles.safeAreaView} >


        {!loading && mr.hasOwnProperty('id') ? (
        <View style={styles.safeAreaView}>        
        <View>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 20, marginBottom: 10 }}>Status: {mr.merge_status == 'can_be_merged' ? <Text style={{color:'#006621'}}>Can be merged!</Text> : <Text style={{color:'#DE1738'}}>Cannot be merged.</Text> }</Text>
        </View>
        {mr.merge_status == 'can_be_merged' && (
        <View style={{flexDirection:'row', justifyContent: 'space-between', marginVertical: 10}}>
                <TouchableOpacity onPress={() => showAlert(0)} style={styles.btnSaveLabels}>
                <Icon type="font-awesome" name="check" color="#FFF"/>
                </TouchableOpacity>
               <TouchableOpacity onPress={() => showAlert(1)} style={styles.btnAddLabel}>
                    <Icon type="font-awesome" name="times" color="#fff"/>
                </TouchableOpacity>
        </View>
        )}

        <ScrollView style={{alignSelf: 'stretch'}}>

            <View>

        <ListItem 
                leftAvatar={{ source: { uri: mr.author.avatar_url.replace('gitlab.usto.re', '10.0.30.9')} } } 
                title={mr.author.name}
                subtitle='Author'
              />
        <ListItem
            title={mr.title}
            subtitle='Title'
          />

        <ListItem 
            title={mr.source_branch}
            subtitle='Source branch'
          />

        <ListItem 
            title={mr.target_branch}
            subtitle='Target branch'
          />

        <ListItem 
            title={mr.state}
            subtitle='State'
        />

        <ListItem 
            title={mr.created_at}
            subtitle='Created at'
          />
        

        {mr.milestone && (
        <ListItem 
            title={mr.milestone.title}
            subtitle='Milestone'
          />
        )}
        </View>
        </ScrollView>

        </View>
        ) : (
            <View style={styles.loadingView}>
                <ActivityIndicator style={styles.loadingIndicator} size="large" color="#000" />
                <Text style={styles.loadingText}>Getting merge requests...</Text>
            </View>
        )} 

        {allBlackScreen && (
          <View style={styles.matchContainer}>
                
           
             {!loadingMr && !mergeRequestRes.error && mergeRequestRes.method == 0 && (
               <View>
                 <Icon type="font-awesome" name="check" color="#00AB66" />
                 <Text style={{fontWeight:'bold', fontSize: 21, color:'#fff'}}>{mergeRequestRes.message}</Text>
               </View>
             )}

             {!loadingMr && !mergeRequestRes.error && mergeRequestRes.method == 1 && (
                <View>                
                <Icon type="font-awesome" name="check" color="#FFAE42" />
               <Text style={{fontWeight:'bold', fontSize: 21, color:'#fff'}}>{mergeRequestRes.message}</Text>
               </View>
             )}

             {!loadingMr && mergeRequestRes.error && (
             <View>
               <Icon type="font-awesome" name="times" color="#FF0000" />
               <Text style={{fontWeight:'bold', fontSize: 21, color:'#fff'}}>Failed! No authorization.</Text>
             </View>
             )}

               {loadingMr && (
                 <View>
                   <ActivityIndicator style={{marginTop:20}} size="large" color="#fff" />
                     <Text>Resolving...</Text>
                 </View>
               )}

            <TouchableOpacity onPress={() => setAllBlackScreen(false)} style={styles.matchCloseBtn}>
                <Text style={styles.closeMatch}>Close</Text>    
            </TouchableOpacity>
     
        </View>
        )}

    </SafeAreaView>  
  );  
}
