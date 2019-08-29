import { createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';
import Points from './pages/Points';

export default createAppContainer(
    createSwitchNavigator(
        {
        Auth: Login,
        App: Main,
        Points
    },
     {
        initialRouteName: 'Auth',
        }
    )
);
   

