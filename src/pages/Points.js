import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem } from 'react-native-elements';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import { Container } from './styles';
import logo from '../assets/logo.png';
import api from '../services/api';
export default function Points({ navigation }) {
    const [object, setObj] = useState(navigation.getParam('data'));


    
    const [peoples, setPeoples] = useState([]);
    const [loading, setLoading] = useState(false);
    const [getCount, setCount] = useState(0);
    var counting = 0;

    useEffect(() => {
        if(object.token != null){
            AsyncStorage.getItem('token').then(token => {
                if(!token) {
                    navigation.navigate('Auth');
                }
            });
        }
        
    }, []);

    useEffect(() => {
        
        async function getIssuesByProjectId(project_id, page = 1){
            // return new Promise(resolve => {

            setLoading(true);
            await api.get(`/api/v4/projects/${project_id}/issues?milestone=${object.milestone}&per_page=100&page=${page}`, {
                headers:{
                    "Authorization": " Bearer "+object.token
                },
                timeout: 3000
            }).then(response => {
                console.log(response.data);
                response.data.map(issue => {
                let firsttValid = false;
                let secondValid = false;
                if(issue.state == "closed"){
                    firsttValid = true; 
                }else{
                    issue.labels.map(o => {
                        if(o.toLowerCase() == "done" || o.toLowerCase() == "closed")
                        firsttValid = true;                   
                    })
                }
                if(firsttValid){
                    issue.labels.map(o => {
                        if(parseFloat(o) != NaN && (parseFloat(o) > 0 && parseFloat(o) < 22))
                        secondValid = true;    
                    })
                    if(secondValid){      
                        let findPeople = peoples.findIndex(p => p.name == issue.assignee.username);
                        let mapLabel = issue.labels.map(l => parseFloat(l));
                        var points = mapLabel.filter(l => l != NaN ? true : false);
                        if(findPeople != -1){
                            peoples[findPeople].tasks+=1;
                            peoples[findPeople].points+=points[0];
                            setPeoples(peoples);
                         }else{
                             peoples.push({
                                 name: issue.assignee.username,
                                 avatar: issue.assignee.avatar_url.replace('gitlab.usto.re', '10.0.30.9'),
                                 tasks: 1,
                                 points: parseInt(points[0])
                                })
                                setPeoples(peoples);
                            }
                        }
                    }
                    
                })
                if(response.data.length == 100) return getIssuesByProjectId(project_id, page++);
                counting++;
                console.log(counting);
            }).catch(e => console.log(e) );

        // })
        }
        
        var count1 = 0;
        async function LoadMain (){
            if(object.projects[0])
            await getIssuesByProjectId(object.projects[0]);

            if(object.projects[1])
            await getIssuesByProjectId(object.projects[1]);

            if(object.projects[2])
            await getIssuesByProjectId(object.projects[2]);

           if(counting == object.projects.length) setLoading(false);

        }

        LoadMain()
        //         if(count == object.projects.length) {
        //             setLoading(false);
        //         }
        //     }, 3000*i);
        // });
    }, []);

     return (
        <View>
        {!loading && peoples.length > 0 ? (
            peoples.map((p, i) => 
                <ListItem
        key={i}
        leftAvatar={{ source: { uri: p.avatar } }}
        title={p.name}
        rightTitle={'Points: '+p.points}
        subtitle={'Closed tasks: '+p.tasks.toString()}
             />
        )
    )
       : ( 
        <View style={styles.loadingView}>
            <ActivityIndicator style={{marginTop:20}} size="large" color="#000" />
            <Text style={{color:'#000'}}>Get data...</Text>
        </View>
       )
       }
      </View>  
     )

    }
    const styles = StyleSheet.create({
        loadingView:{
            alignSelf: 'center',  
            justifyContent: 'center',
        }, 
    });
