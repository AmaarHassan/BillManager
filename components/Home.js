import React from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';

export default class Home extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Header
                    placement="left"
                    leftComponent={{ icon: 'home', color: '#fff' }}
                    centerComponent={{ text: 'Home', style: { color: '#fff' } }}
                />

                <View style={styles.titleContainer}>
                    <Text style={styles.title}> Manage Your Bills So You Can Save </Text>
                </View>

                <Image source={require('../assets/BillManager_HomeScreen.png')} />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={()=>{this.props.history.push('/create')}}>
                        <Text > Create </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>{this.props.history.push('/create')} }>
                        <Text> List </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, margin: 0, padding: 0 
    },
    titleContainer: {
        height: 80,
        backgroundColor: 'white',
        color: 'dodgerblue',
        alignItems: 'center',
        justifyContent: 'center',
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
        textAlign:'center'
    }
});
