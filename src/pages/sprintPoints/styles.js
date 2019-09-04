import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    viewCheckBoxed: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex:1

    },
    textinvalid:{
        borderColor: "#ff0000"
    },
    container: {
        flex:1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    loadingView:{
        alignSelf: 'center',  
        justifyContent: 'center',
    }, 
    logo :{ 
        marginTop: 30
    },
    input: {
        height:46,
        alignSelf: 'stretch',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 20,
        paddingHorizontal: 15,
        
    },
    cardsContainer: {
        flex:1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    button: {
        padding:20,
    },
    card: {
      borderWidth:1,
      borderColor: '#ddd',
      borderRadius: 8,
      margin: 30,
      overflow: 'hidden',
      position: 'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
    },
    avatar: {
        flex:1,
        height:300
    },
    footer:{
        paddingHorizontal: 20,
        paddingVertical:15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color : '#999',
        marginTop: 5,
        lineHeight: 18
    }, 
    buttonsContainer:{
        flexDirection: 'row',
        marginBottom: 30,
    },
    button : {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    endText:{
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#999'
    },
    matchContainer:{
        ... StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    matchProfile: {
        height: 160,
        width: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },
    matchName: {
        fontWeight: 'bold',
        color:'#fff',
        fontSize:26,
        alignSelf:'center'
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color:'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
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
    matchImage: {
        height: 60,
        resizeMode: 'contain'
    }
});

export default styles;