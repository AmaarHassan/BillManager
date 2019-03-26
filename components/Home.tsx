import React from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Platform } from 'react-native';
import Header from './header';

export default class Home extends React.Component<any, any>  {
    render() {
        return (
            <View style={styles.container}>
                    <Header />

                    <Image style={styles.bodyImage} source={require('../assets/BillManager_HomeScreen.png')} />

                    <View style={styles.textContainer}>
                        <Text style={{ color: 'dodgerblue', textAlign: 'center' }}> lorem ipsum jingo django espanyol luca modirc nu real madrid pay kono miko saka hoko taji kage bun shin no jutsu shhakar buzzinga </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => { this.props.history.push('/bills') }}>
                            <Text > List </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => { this.props.history.push('/create') }}>
                            <Text> Create </Text>
                        </TouchableOpacity>
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, margin: 0, padding: 0, alignItems: 'center'
    },
    bodyImage:{
        marginTop: 70, 
        height:200, 
        width:150
    },
    textContainer: {
        width: 200,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: Platform.OS!='web'?-50:10
    },
    title: {
        fontSize: 20
    },
    button: {
        width: 120,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 20,
        margin: 10
    }
});
