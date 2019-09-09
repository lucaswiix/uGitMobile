import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem } from 'react-native-elements';
import { View, SafeAreaView, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// import { Container } from './styles';
import logo from 'assets/logo.png';
import axios from 'axios';
import api from 'services/api';

export default function Points({ navigation }) {
    const [object, setObj] = useState(navigation.getParam('data'));

    const [empty, setEmpty] = useState(false);
    const [getTotal, setTotal] = useState(0);
    const [peoples, setPeoples] = useState([]);
    const [loading, setLoading] = useState(false);
    const [getMessage, setMessage] = useState('Get data...');
    const [countTasks, setCountTasks] = useState(0);
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
        var total = 0;
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function getIssuesByProjectId(project_id, page = 1){
            // return new Promise(resolve => {

            setLoading(true);
            await api.get(`/api/v4/projects/${project_id}/issues?milestone=${object.milestone}&per_page=100&page=${page}`, {
                cancelToken: source.token,
                headers:{
                    "Authorization": " Bearer "+object.token
                },
                timeout: 5000
            }).then(response => {

                if(response.data.length > 0){

                    let validArray = [];
                    let issues = response.data;

                    if(object.isClosed)
                        issues = response.data.filter(issue => issue.state == 'closed');
                    
                    issues = response.data.filter(issues => issues.assignee);

                    if(object.labels.length > 0)
                    object.labels.map(label => {                            
                        issues.forEach(issue => {        
                                    let map = issue.labels.some(rlabel => rlabel.toLowerCase() == label.toLowerCase());
                                    if(map) validArray.push(issue);
                                });
                        // let filtred = issues.filter(is => is.labels.some(ll => ll.toLowerCase() == label.toLowerCase()));
                        // validArray = filtred;
                        });
                    else
                        validArray = issues;

                    console.log('ValidArray: ', validArray)
                    console.log('Object Labels Length: ', object.labels.length)
                let validIssues = validArray.filter(issue => 
                    (
                    issue.labels.includes('1') ||
                    issue.labels.includes('2') ||
                    issue.labels.includes('3') ||
                    issue.labels.includes('5') ||
                    issue.labels.includes('8') ||
                    issue.labels.includes('13') ||
                    issue.labels.includes('21') ||
                    issue.labels.includes('34')
                    ));

                console.log(`${project_id} - validIssues`, validIssues);
                if(validIssues.length < 1) {
                    setEmpty(true);
                    return;
                }

                validIssues.map(issue => {
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
                                });

                                setPeoples(peoples);
                            }
                            total += points;
                })
                setTotal(total);
                if(response.data.length == 100) return getIssuesByProjectId(project_id, page++);
            }else{
                setEmpty(true);
                setMessage('Invalid milestone name');
            }

            }).catch(e => console.log(e) );

            counting+=1;
        }
        
        async function LoadMain (){
            counting = 0;

            console.log('Project Ids: ',object.projects);

            if(object.projects[0])
                await getIssuesByProjectId(object.projects[0]);
            

            if(object.projects[1])
            await getIssuesByProjectId(object.projects[1]);

            if(object.projects[2])
            await getIssuesByProjectId(object.projects[2]);

            getTotalTasks();

           if(counting == object.projects.length) setLoading(false);

        }

        LoadMain();
        return () => {
            source.cancel();
          };

    }, []);


    async function getTotalTasks(){
        let count = 0;
        peoples.map(o => count+=o.tasks);
        setCountTasks(count);
    }

     return (
        <SafeAreaView style={styles.container}>
            <View style={{alignItems: 'center', flexDirection: 'column'}}>

                <Image style={styles.logo} source={logo}/>
            </View>
            <ScrollView>

        {!empty && !loading && peoples.length > 0 && (
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
    )}
        
        {loading && (
        <View style={styles.loadingView}>
            <ActivityIndicator style={{marginTop:20}} size="large" color="#000" />
            <Text style={{color:'#000'}}>{getMessage}</Text>
        </View>
        )
       }

       {empty && (
        <View style={styles.loadingView}>
           <Text style={{color:'#000'}}>No issues found.</Text>
       </View>
       )}
       

       {!loading && peoples.length > 0 && (
            <View style={{alignSelf:'center', marginVertical: 30}}>
                <Text style={{fontWeight: 'bold'}}>Total Tasks: {countTasks}</Text>
                <Text style={{fontWeight: 'bold'}}>Total Points: {getTotal}</Text>
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
