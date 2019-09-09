import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    btnChangeProject:{
        justifyContent: 'center',
        flex:1
    },
    loadingView:{
        alignSelf: 'center',  
        justifyContent: 'center',
    }, 
    loadingIndicator:{
        marginTop: 30
    },
    loadingText: {
        fontWeight: 'bold'
    },
    safeAreaView: {
        flex:1, 
        backgroundColor: '#F5F5F5'
    },
    btnClose: {
        height:46,
        alignSelf: 'stretch',
        flex:1,
        backgroundColor: '#ccc',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnSaveLabels: {
        height:46,
        alignSelf: 'stretch',
        flex:1,
        backgroundColor: '#008000',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnAddLabel: {
        height:46,
        alignSelf: 'stretch',
        flex:1,
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnAddLabelText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    matchContainer:{
        ... StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    matchCloseBtn: {
        alignSelf:'center',
        color:'#fff',
    },
    closeMatch: {
        fontSize: 16,      
        color:'rgba(255, 255, 255, 0.8)',
        marginTop: 30,
        textAlign: 'center',
        fontWeight:'bold'
    },
});

