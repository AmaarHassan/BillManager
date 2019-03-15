import React from 'react';
import { Platform, StyleSheet, Text, View, FlatList } from 'react-native';
import { Header } from 'react-native-elements';

import { graphql } from 'react-apollo';
import { getBillsQuery } from './queries/queries';

import Bill from './Bill';
import IBill from './interfaces/IBill';


class BillsList extends React.Component<any, any>  {
    constructor(props: any) {
        super(props);
        this.state = {
            columns: (Platform.OS == 'android') ? 2 : 3,
        };
        this.displayBills = this.displayBills.bind(this);
    }
    displayBills = () => {
        const data = this.props.data;
        if (data.loading) {
            return (
                <Text> Loading Bills ... Empty your pockets now! </Text>
            );
        } else {
            return (
                <FlatList numColumns={this.state.columns}
                data={this.props.data.bills}
                renderItem={({ item }) => {
                  return (
                    <Bill id={item.id} bill={item} />
                  );
                }}
                keyExtractor={(item, index) => index}
              />                
            )
        }
    }
    render() {
        return (
            <View style={{flex:1}}>
                <Header
                    placement="left"
                    leftComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.history.push('/') }}
                    centerComponent={{ text: 'Bills', style: { color: '#fff' } }}
                />
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
        padding: 8
    },
});

export default graphql(getBillsQuery)(BillsList)
