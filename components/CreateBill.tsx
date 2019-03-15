import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Picker, Alert, AppRegistry } from 'react-native';
import { compose, graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Route, MemoryRouter, Switch } from 'react-router';
import { TouchableOpacity } from 'react-native';
import { Header, Icon } from 'react-native-elements';

import Asset from './interfaces/IBill';
//import mutation query from queries
import { getBillsQuery } from './queries/queries';

export interface Props {
    history?: any
}

enum Site {
    Home,
    Office
}

const addBill = gql`
  mutation addBill($title: String, $site: String, $month: String, $unitRate: Float, $unitsConsumed: Float, $assets: Json) {
    createBill(data: { title: $title, site: $site, month: $month, unitRate: $unitRate, unitsConsumed: $unitsConsumed, assets: $assets }) {
      id
    }
  }
`;

export default class CreateBill extends React.Component<any, any>  {
    constructor(props: any) {
        super(props);
        this.state = {
            title: "",
            site: "Home",
            month: "January",
            unitRate: 0.0,
            unitsConsumed: 0.0,
            response: "",
            assets: [{ device: "", company: "", power: 0 }]
        }
    }  

    handleAssetDeviceChange(i: number, text: string) {
        let newAssets = [...this.state.assets];
        newAssets[i].device = text;
        this.setState({ assets: newAssets });
    }
    handleAssetCompanyChange(i: number, text: string) {
        let newAssets = [...this.state.assets];
        newAssets[i].company = text;
        this.setState({ assets: newAssets });
    }
    handleAssetPowerChange(i: number, text: number) {
        let newAssets = [...this.state.assets];
        newAssets[i].power = text;
        this.setState({ assets: newAssets });
    }

    handleAddAsset = () => {
        this.setState({
            assets: this.state.assets.concat([{ device: "" }])
        });
    };

    handleRemoveAsset = (idx: number) => {
        this.setState({
            assets: this.state.assets.filter((asset, assetIdx) => idx != assetIdx)
        });
    };

    // handleSubmit = () => {
    //     addBillMutation({
    //         variables: {
    //             title: this.state.title,
    //             site: this.state.site,
    //             month: this.state.month,
    //             unitRate: this.state.unitRate,
    //             unitsConsumed: this.state.unitsConsumed,
    //             // assets: this.state.assets
    //         }// in order to re-render the books list, we refresh its query
    //     }).then(res => res)
    //         .catch(err => <Text>{err}</Text>);
    // };

    render() {
        const backSign: String = "<-Home";
        return (
            <Mutation mutation={addBill} refetchQueries={[{ query: getBillsQuery }]}>
                {(addBillMutation, { data }) => (
                    <View style={{ flex: 1 }}>
                        <Header
                            placement="left"
                            leftComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.history.push('/') }}
                            centerComponent={{ text: 'Create Bill', style: { color: '#fff' } }}
                        />
                        <View style={styles.container}>

                            <View>
                                <Text style={styles.fieldTitle}> Bill Name </Text>
                                <View style={{ flexDirection: 'row', padding: 0, margin: 0 }}>
                                    <Icon raised name='heartbeat' type='font-awesome' color='#f50' />
                                    <View style={styles.fieldContainer}>
                                        <TextInput style={styles.field}
                                            onChangeText={(text) => { this.setState({ title: text }) }}
                                            placeholder="Bill title goes here" />
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.fieldTitle}> Site </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon raised name='heartbeat' type='font-awesome' color='#f50' />
                                        <View style={{ width: 100 }}>
                                            <Picker selectedValue={this.state.site} onValueChange={(itemValue, itemIndex) =>
                                                this.setState({ site: itemValue })
                                            }>
                                                <Picker.Item label="Home" value="Home" />
                                                <Picker.Item label="Office" value="Office" />
                                            </Picker>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.fieldTitle}> Month </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon raised name='home' type='font-awesome' color='#dae' />
                                        <View style={{ width: 100 }}>
                                            <Picker selectedValue={this.state.month} onValueChange={(itemValue, itemIndex) =>
                                                this.setState({ month: itemValue })
                                            }>
                                                <Picker.Item label="January" value="January" />
                                                <Picker.Item label="February" value="February" />
                                                <Picker.Item label="March" value="March" />
                                                <Picker.Item label="April" value="April" />
                                                <Picker.Item label="May" value="May" />
                                                <Picker.Item label="June" value="June" />
                                                <Picker.Item label="July" value="July" />
                                                <Picker.Item label="August" value="August" />
                                                <Picker.Item label="September" value="September" />
                                                <Picker.Item label="October" value="October" />
                                                <Picker.Item label="November" value="November" />
                                                <Picker.Item label="December" value="December" />
                                            </Picker>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon raised name='heartbeat' type='font-awesome' color='#f50' />
                                    <View style={{ borderBottomColor: 'dodgerblue', borderBottomWidth: 1 }}>
                                        <TextInput placeholder="Unit Rate"
                                            onChangeText={(text) => { this.setState({ unitRate: parseFloat(text) }) }}
                                            keyboardType='numeric'
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon raised name='heartbeat' type='font-awesome' color='#f50' />
                                    <View style={{ borderBottomColor: 'dodgerblue', borderBottomWidth: 1 }}>
                                        <TextInput placeholder="Units Consumed"
                                            keyboardType='numeric'
                                            onChangeText={(text) => { this.setState({ unitsConsumed: parseFloat(text) }) }} 
                                        />
                                    </View>
                                </View>

                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 12 }}>
                                {this.state.assets.map((asset, idx) => (
                                    <View key={idx} style={{ flexDirection: 'row', padding: 5, justifyContent: 'space-between' }}>
                                        <Text>{`Asset #${idx + 1}`}</Text>
                                        <View style={styles.fieldContainer}>
                                            <TextInput
                                                placeholder={`device`}
                                                onChangeText={(text) => { this.handleAssetDeviceChange(idx, text) }}
                                            />
                                        </View>
                                        <View style={styles.fieldContainer}>
                                            <TextInput
                                                placeholder={` company`}
                                                onChangeText={(text) => { this.handleAssetCompanyChange(idx, text) }}
                                            />
                                        </View>
                                        <View style={styles.fieldContainer}>
                                            <TextInput
                                                placeholder={` power`}
                                                keyboardType='numeric'
                                                onChangeText={(text) => { this.handleAssetPowerChange(idx, parseFloat(text)) }}
                                            />
                                        </View>

                                        <TouchableOpacity style={styles.deleteButton} onPress={() => { this.handleRemoveAsset(idx) }}>
                                            <Text style={{ color: 'white', fontSize: 16 }}>-</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <TouchableOpacity style={styles.addButton} onPress={() => { this.handleAddAsset() }}>
                                    <Text style={{ color: 'white', fontSize: 16 }}>+</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                        <TouchableOpacity onPress={() => {
                            addBillMutation({
                                variables: {
                                    title: this.state.title,
                                    site: this.state.site,
                                    month: this.state.month,
                                    unitRate: this.state.unitRate,
                                    unitsConsumed: this.state.unitsConsumed,
                                    assets: this.state.assets
                                }
                            }).then(res => this.setState({ response: JSON.stringify(res) }))
                                .catch(err => this.setState({ response: JSON.stringify(err) }));
                        }}>
                        <View style={{alignItems:'center', alignText: 'center'}}>
                            <Text style={{ color: 'dodgerblue', fontSize: 18 }}> Next </Text>
                        </View>
                        </TouchableOpacity>
                        <Text>{this.state.response}</Text>
                    </View >

                )}
            </Mutation>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 100,
        color: 'white',
    },
    fieldContainer: {
        borderBottomColor: 'dodgerblue',
        borderBottomWidth: 1,
        flex: 1,
    },
    fieldTitle: {
        fontSize: 10,
        color: 'dodgerblue',
        marginLeft: 60,
    },
    field: {
        height: 60,
        paddingLeft: 6,
        padding: 2,
        fontSize: 16
    },
    assetField: {
        margin: 5,
    },
    deleteButton: {
        backgroundColor: '#EA7B55',
        borderRadius: 20,
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        overflow: 'hidden',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: 40, height: 40,
    },
    addButton: {
        backgroundColor: '#9DF359',
        borderRadius: 20,
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        overflow: 'hidden',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: 40, height: 40,
    },
});