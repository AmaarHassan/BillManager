import React from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Platform } from 'react-native';

export default class Header extends React.Component<any, any>  {
    render() {
        return (
            <View style={styles.headerContainer}>
            <Text style={styles.headerText}> &#9731; </Text>
                <TouchableOpacity onPress={() => { this.props.history.push('/') }}>
                    <Text style={styles.headerText}> Home </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#39F',
        width: '100%',
        height: '10%',
        //justifyContent: 'space-between'
        //        alignItems: 'center'
    },
    headerText: {
        color: 'white',
        marginTop: Platform.OS == 'web' ? 0 : 25,
        fontSize: 12
    }

});
