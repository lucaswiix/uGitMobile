import React from 'react';
import {
    createAppContainer,
    createSwitchNavigator,
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';

import Auth from '../pages/Login';
import {
    Icon
} from 'react-native-elements'

import Index from '../pages/sprintPoints/Index';
import Result from '../pages/sprintPoints/Result';

import mergeRequextIndex from 'pages/mergeRequests/';

/* DASHBOARD STACKS */
import dashboardPage from '../pages/dashboard';

import Details from '/pages/mergeRequests/details';
import settings from '../pages/settings';

const sprintPointsPage = createStackNavigator({
    Index: {
        screen: Index,
        navigationOptions: {
            header: null,
        },
    },
    Result
}, {
    initialRouteName: 'Index',
});


const mergeRequests = createStackNavigator({
    Index: {
        screen: mergeRequextIndex,
        navigationOptions: {
            header: null,
        },
    },
    details: {
        screen: Details,
    }
}, {

    initialRouteName: 'Index'
});



const dashBoard = createSwitchNavigator({
    Index:{
        screen: dashboardPage
    }
}, {initialRouteName:'Index'});

const MainNavigation = createBottomTabNavigator({
    dashBoard:{
        screen: dashBoard,
        navigationOptions: {
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({
                focused,
                tintColor
            }) => {
                const iconName = `tachometer`;
                return <Icon 
                type="font-awesome"
                name = {
                    iconName
                }
                size = {
                    25
                }
                color = {
                    tintColor
                }
                />;
            },
        },
    },
    SprintPoints: {
        screen: sprintPointsPage,
        navigationOptions: {
            tabBarLabel: 'Sprint Points',
            tabBarIcon: ({
                focused,
                tintColor
            }) => {
                const iconName = `desktop`;
                return <Icon 
                type="font-awesome"
                name = {
                    iconName
                }
                size = {
                    25
                }
                color = {
                    tintColor
                }
                />;
            },
        },
    },
    mergeRequests: {
        screen: mergeRequests,
        navigationOptions: {
            tabBarLabel: 'Merge Requests',
            tabBarIcon: ({
                focused,
                tintColor
            }) => {
                const iconName = `code-fork`;
                return <Icon 
                type="font-awesome"
                name = {
                    iconName
                }
                size = {
                    25
                }
                color = {
                    tintColor
                }
                />;
            },
        },
    },
    settings: {
        screen: settings,
        navigationOptions: {
            tabBarLabel: 'Logout',
            tabBarIcon: ({
                focused,
                tintColor
            }) => {
                const iconName = `sign-out`;
                return <Icon 
                type="font-awesome"
                name = {
                    iconName
                }
                size = {
                    25
                }
                color = {
                    tintColor
                }
                />;
            },
        },
    },
}, {
    initialRouteName: 'dashBoard',
})


const homeNavigation = createSwitchNavigator({
    Auth,
    App: MainNavigation,
}, {
    initialRouteName: 'Auth',
});


export default createAppContainer(homeNavigation);