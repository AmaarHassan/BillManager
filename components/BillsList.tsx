import React from 'react';
import { Platform, BackHandler, StyleSheet, Picker, View, FlatList, Text, ActivityIndicator } from 'react-native';
// import { Header } from 'react-native-elements';

import { graphql } from 'react-apollo';
import { getBillsQuery } from './queries/queries';

import Bill from './Bill';
import IBill from './interfaces/IBill';
import Header from './header';

class BillsList extends React.Component<any, any>  {
    constructor(props: any) {
        super(props);
        this.state = {
            columns: (Platform.OS == 'android' || Platform.OS=="ios") ? 2 : 5,
        };
        this.displayBills = this.displayBills.bind(this);
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick = () => {
        this.props.history.push('/');
        return true;
    }
    renderSearch = () => {
        return (
            <View style={{ width: 60 }}>
                <Picker selectedValue={this.state.columns} onValueChange={(itemValue) =>
                    this.setState({ columns: itemValue })
                }>
                    <Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                </Picker>
            </View>
        )
    }
    displayBills = () => {
        const data = this.props.data;
        if (data.loading) {
            return (
                <ActivityIndicator size="large" color="#0000ff" />
            )
        }
        else if (data.error) {
            return (
                <Text> Error Occured  {data.error.toString()} </Text>
            )
        } else if (data.empty) {
            return (
                <Text> No Data Found  {data.empty.toString()}</Text>
            )
        }
        else {
            return (
                <FlatList
                    key={this.state.columns}
                    numColumns={this.state.columns}
                    data={this.props.data.bills}
                    renderItem={({ item }) => {
                        return (
                            <Bill key={item.id} id={item.id} bill={item} />
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            )
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ecf0f1', }}>
               <Header/>
                <View style={styles.container}>
                    {this.displayBills()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
        marginLeft: Platform.OS=="web"? "3%" : 0,
    }
});

export default graphql(getBillsQuery)(BillsList)
