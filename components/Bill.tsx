import React from 'react';
import {
    Modal, FlatList, StyleSheet, Text, View,
    TouchableOpacity, ActivityIndicator, Platform, Image
} from 'react-native';
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
                                <Text style={styles.modalDescription}> {item.device.toUpperCase()} </Text>
                                <Text style={styles.modalDescription}> {item.company.toUpperCase()} </Text>
                                <Text style={styles.modalDescription}> {item.power} </Text>
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            )
        } else return (<Text style={{ marginTop: 200, marginBottom: 200 }}>No Assets Found </Text>)
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
                        <Text style={styles.modalCloseText}> Tap to Close </Text>
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
                    <View style={styles.cardBody}>
                        <Text style={styles.cardBodyText}>{this.props.bill.title}</Text>
                        <Text style={styles.cardBodyText}>
                            {this.addCommas(this.props.bill.unitRate * this.props.bill.unitsConsumed).toString()}
                        </Text>
                    </View>

                    <View style={styles.cardTail}>
                        <View style={ styles.tailDescriptionTextContainer }>
                            <Text style={styles.cardTailText}> Lorem Ipsum </Text>
                        </View>
                        <View style={styles.tailIconMonthContainer}>
                            <Image style={styles.tailIcon} source={require('../assets/icons/clock.png')} />
                            <Text style={styles.cardTailText}>{this.props.bill.month.toString()}</Text>
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
        maxWidth: Platform.OS == 'web' ? 200 : 140
    },
    cardBody: {
        padding: 5,
        margin: 5,
        height: 100
    },
    cardBodyText: {
        color: 'white'
    },
    cardTail: {
        flex: 1,
        backgroundColor: '#90caf9',
        padding: 5,
        justifyContent:'center'
    },
    tailIconTextContainer: {
        flex: 1,
        padding: 5,
        marginLeft: -7,
        flexDirection: 'row',
        margin: 0
    },
    cardTailText: {
        color: 'white',
        marginLeft: 5,
        marginTop:-2
    },
    tailDescriptionTextContainer:{
        flex: 1,
        padding: 5 , 
        marginLeft:-6
    },
    tailIconMonthContainer:{
        marginLeft: 5, 
        flexDirection: 'row',
        paddingBottom:8
    },
    tailIcon: {
        height: 15,
        width: 15,
        padding: 5,
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
    modalDescription: {
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
    modalCloseText: {
        color: 'dodgerblue',
        marginTop: -20
    },
    modalTitle: {
        fontSize: 16,
        marginTop: 5,
        textAlign: 'center',
    }
});