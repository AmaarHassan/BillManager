import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Route, MemoryRouter, Switch } from 'react-router';
import { TouchableOpacity } from 'react-native';
import { Header, Icon } from 'react-native-elements';

export interface Props{
    history?: any
}

export default class CreateBill extends React.Component<Props,any>  {
    constructor(props:Props){
        super(props);
    }
    render() {
        const backSign:String = "<-Home";
        return (
            <View style={{flex:1}}>
                <Header
                    placement="left"
                    leftComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.history.push('/') }}
                    centerComponent={{ text: 'Create Bill', style: { color: '#fff' } }}
                />

                <View style={styles.container}>
                    <Text style={{ fontSize: 20 }}>Create a new bill</Text>
                    <TextInput placeholder="Enter something" />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        padding: 10,
        marginTop: 10
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 100,
        color: 'white',
    },
});
