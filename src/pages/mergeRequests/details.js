import React, { Component, useEffect, useState } from 'react';

import { View, Text, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

export default function mergeRequests({ navigation }) {
    const data = navigation.getParam('data');
    const [mr, setMr] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setMr(data);
        setLoading(false);
    }, [data]);
  return (
    <SafeAreaView style={styles.safeAreaView} >

        {!loading && mr.hasOwnProperty('id') ? (
        <View style={styles.safeAreaView}>        
        <View>
            <Text style={{fontWeight: 'bold', fontSize: 18, margin: 20 }}>Status: {mr.merge_status == 'can_be_merged' ? <Text style={{color:'#006621'}}>Can be merged!</Text> : <Text style={{color:'#DE1738'}}>Cannot be merged.</Text> }</Text>
        </View>
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

    </SafeAreaView>  
  );  
}
