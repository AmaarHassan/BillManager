import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StatusBar, StatusBarAnimation } from 'react-native';
import { Route, MemoryRouter, Switch } from 'react-router';
import { TouchableOpacity } from 'react-native';
import { Header, Icon, Form, FormInput } from 'react-native-elements';

export const backSign = "<-Home";

export default class CreateBill extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="left"
                    leftComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.history.push('/') }}
                    centerComponent={{ text: 'Create Bill', style: { color: '#fff' } }}
                />

                <View style={styles.container}>

                    <TextInput placeholder="Enter something"/>
                    {/* <Form label="Personal Information">
                        <FormInput />
                        <FormInput />
                    </Form> */}

                </View>
            </View >
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
