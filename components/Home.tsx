import React from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';

export default class Home extends React.Component<any,any>  {
    render() {
        return (
            <View style={styles.container}>
                <Header
                    placement="left"
                    leftComponent={{ icon: 'home', color: '#fff' }}
                    centerComponent={{ text: 'Home', style: { color: '#fff' } }}
                />

                <Image style={{marginTop:70}} source={require('../assets/BillManager_HomeScreen.png')} />

                <View style={styles.textContainer}>
                    <Text style={{color:'dodgerblue', textAlign:'center'}}> lorem ipsum jingo django espanyol luca modirc nu real madrid pay khoobsorat shhakar buzzinga </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={()=>{this.props.history.push('/bills')}}>
                        <Text > List </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>{this.props.history.push('/create')} }>
                        <Text> Create </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, margin: 0, padding: 0, alignItems:'center'
    },
    textContainer: {
        width: 200,
        backgroundColor: 'white',
        color: 'dodgerblue',
        textAlign:'center'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    title: {
        fontSize: 20
    },
    button: {
        width: 120,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius:20,
        textAlign:'center',
        margin: 10
    }
});
