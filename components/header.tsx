import React from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Platform } from 'react-native';
import { withRouter } from 'react-router'

class Header extends React.Component<any, any>  {
    constructor(props) {
        super(props);
        this.state = {
            screenText: ""
        }
    }
    componentDidMount() {
        const path = this.props.location.pathname;
        let pathname = "";
        if (path == "/") pathname = "";
        else if (path == "/bills") pathname = "Bills List";
        else if (path == "/create") pathname = "Create Bill";
        this.setState({
            screenText: pathname
        })
    }
    render() {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.props.history.push('/') }}>
                    <Image style={styles.iconImage} source={require('../assets/icons/home.png')} />
                    <Text style={styles.headerText}> Home </Text>
                </TouchableOpacity>
                <Text style={styles.screenText}>{this.props.location.pathname != "/" ? " >" : ""}</Text>
                <TouchableOpacity onPress={() => { this.props.history.push(this.props.location.pathname) }}>
                    <Text style={styles.screenText}>
                        {this.state.screenText} </Text>
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
        marginTop: Platform.OS == 'web' ? 4 : 27,
        marginLeft: Platform.OS == 'web' ? 8 : 4,
        fontSize: 12
    },
    iconImage: {
        marginTop: Platform.OS == 'web' ? 0 : 25,
        height: 17,
        width: 17,
    },
    screenText: {
        color: 'white',
        marginTop: Platform.OS == 'web' ? 4.5 : 27,
        marginLeft: Platform.OS == 'web' ? 8 : 4,
        fontSize: 12
    }

});

export default withRouter(Header);
