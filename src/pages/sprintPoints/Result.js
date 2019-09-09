import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem } from 'react-native-elements';
import { View, SafeAreaView, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// import { Container } from './styles';
import logo from 'assets/logo.png';
import api from 'services/api';

export default function Points({ navigation }) {
    const [object, setObj] = useState(navigation.getParam('data'));


    const [ getTotal, setTotal] = useState(0);
    const [peoples, setPeoples] = useState([]);
    const [loading, setLoading] = useState(false);
    const [getMessage, setMessage] = useState('Get data...');
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
                timeout: 5000
            }).then(response => {
                if(response.data.length > 0){
                var total = 0;
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
                        var p = mapLabel.filter(l => l != NaN ? true : false);
                        let points = parseInt(p[0]);
                        if(findPeople != -1){
                            peoples[findPeople].tasks+=1;
                            peoples[findPeople].points+=points;
                            setPeoples(peoples);
                         }else{
                             peoples.push({
                                 name: issue.assignee.username,
                                 avatar: issue.assignee.avatar_url.replace('gitlab.usto.re', '10.0.30.9'),
                                 tasks: 1,
                                 points: points
                                })
                                setPeoples(peoples);
                            }
                            total += points;
                        }
                    }
                    
                })
                setTotal(total);
                if(response.data.length == 100) return getIssuesByProjectId(project_id, page++);
            }else{
                setMessage('Invalid milestone name');
            }

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
    }, []);



     return (
        <SafeAreaView style={styles.container}>
            <View style={{alignItems: 'center', flexDirection: 'column'}}>

                <Image style={styles.logo} source={logo}/>
            </View>
            <ScrollView>
        {!loading && peoples.length > 0 ? (
            peoples.map((p, i) => 
            <View key={i}>
                <ListItem
        key={i}
        leftAvatar={{ source: { uri: p.avatar } }}
        title={p.name}
        rightTitle={'Points: '+p.points}
        subtitle={'Closed tasks: '+p.tasks.toString()}
        />
        </View>
        )
    )
       : ( 
        <View style={styles.loadingView}>
            <ActivityIndicator style={{marginTop:20}} size="large" color="#000" />
            <Text style={{color:'#000'}}>{getMessage}</Text>
        </View>
       )
       }
       

       {!loading && peoples.length > 0 && (
            <View style={{alignSelf:'center', marginVertical: 30}}>
                <Text style={{fontWeight: 'bold'}}>Total: {getTotal}</Text>
            </View>   
       )}
      </ScrollView>
      </SafeAreaView>  
     )

    }
    
    const styles = StyleSheet.create({
        // eslint-disable-next-line react-native/no-color-literals
        container: {
            backgroundColor: '#F5F5F5',
            flex: 1,
        },
        loadingView:{
            alignSelf: 'center',  
            justifyContent: 'center',
        }, 
        logo :{ 
            marginVertical: 30,
            // eslint-disable-next-line react-native/sort-styles
            alignSelf: 'center',
            justifyContent: 'center',
        },
    });
