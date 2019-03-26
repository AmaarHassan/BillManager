import React from 'react';
import { Modal, FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
// import { Card, Icon } from "react-native-elements";

import Asset from './interfaces/Asset';

export default class Bill extends React.Component<any, any>  {
    constructor(props: any) {
        super(props);
        this.state = {
            modalVisible: false,
        }
    }
    addCommas(x: any) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    showAssets(assets: [Asset]) {
        if (assets.length > 0) {
            return (
                <FlatList listKey={(item: any, index: any) => index.toString()} key={this.props.key} numColumns={1}
                    data={assets}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.modalInside}>
                                <Text style={styles.description}> {item.device.toUpperCase()} </Text>
                                <Text style={styles.description}> {item.company.toUpperCase()} </Text>
                                <Text style={styles.description}> {item.power} </Text>
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            )
        } else return (<Text>Nothing to show </Text>)
    }
    setModalVisible(visible: boolean) {
        this.setState({ modalVisible: visible });
    }
    showModal(platform: string) {
        if (platform == 'android' || platform == 'ios') {
            return (
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                    //style={{ visible: false }}
                    //backdropOpacity={0.3}
                    //swipeDirection="left"
                    //onSwipe={() => { this.setModalVisible(!this.state.modalVisible) }}
                    //onBackdropPress={() => { this.setModalVisible(!this.state.modalVisible) }}
                    onRequestClose={() => console.log('closed')}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPressOut={() => { this.setModalVisible(!this.state.modalVisible) }}
                    >
                        <View>
                            <Text style={styles.modalTitle}> Assets </Text>
                            {this.showAssets(this.props.bill.assets)}
                        </View>
                        <Text style={{ color: 'dodgerblue', marginTop: -20 }}> Tap to Close </Text>
                    </TouchableOpacity>
                </Modal>
            )
        } else if (platform == 'web') {
            return (
                <View>
                </View>
            )
        }
    }
    render() {
        const data = this.props.bill;
        if (data.loading) {
            return (
                <ActivityIndicator size="large" color="#0000ff" />
            );
        } else if (data.error) {
            return (
                <View>
                    <Text> Error + {data.error.toString()} </Text>
                </View>
            );
        } else if (data.empty) {
            return (
                <View>
                    <Text> No Data Found + {data.empty.toString()}</Text>
                </View>
            )
        } else {
            return (
                <TouchableOpacity style={styles.card}
                    onPress={() => {
                        Platform.OS != 'web' ? this.setModalVisible(!this.state.modalVisible)
                            : alert(JSON.stringify(this.props.bill.assets))
                    }} >
                    {this.showModal(Platform.OS)}
                    <View style={{ padding: 5, margin: 5, height: 100 }}>
                        <Text style={styles.bodyText}>{this.props.bill.title}</Text>
                        <Text style={styles.bodyText}>
                            {this.addCommas(this.props.bill.unitRate * this.props.bill.unitsConsumed).toString()}
                        </Text>
                    </View>

                    <View style={styles.tail}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.tailText}> Lorem Ipsum Dolor </Text>
                        </View>
                        <View style={{ flex: 1, padding: 5, marginLeft: -7, flexDirection: 'row', margin: 0 }}>
                            {/* <Icon name='watch' color='#00aced' /> */}
                            <View style={{ flex: 1 }}>
                                <Text style={styles.tailText}>{this.props.bill.month.toString()}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#DDDDDD',
        borderRadius: 20,
        margin: 10
    },
    card: {
        margin: 15,
        flex: 1,
        padding: 0,
        borderRadius: 10,
        backgroundColor: '#39F',
        width: Platform.OS == 'web' ? 250 : 'auto'
    },
    Webcard: {
        margin: 15,
        width: 250,
        padding: 0,
        borderRadius: 10,
        backgroundColor: '#39F',
    },
    tail: {
        flex: 1,
        backgroundColor: '#90caf9',
        padding: 5,
    },
    bodyText: {
        color: 'white'
    },
    tailText: {
        color: 'white'
    },
    titleStyle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    billInfo: {
        marginBottom: 10,
        fontSize: 18,
    },
    modalContainer: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#DCDCDC",
        opacity: 0.9,
        borderRadius: 5,
        borderColor: "#DCDCDC",
        borderWidth: 2,
        marginHorizontal: 40,
        marginVertical: 80,
        flex: 1
    },
    description: {
        padding: 10,
        fontSize: 12,
        width: 100
    },
    modalInside: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderColor: 'pink'
    },
    button: {
        width: 120,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 20,
        margin: 10,
    },
    modalTitle: {
        fontSize: 16,
        marginTop: 5,
        textAlign: 'center',
    }
});