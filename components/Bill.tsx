import React from 'react';
import { Modal, FlatList, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Card, Icon } from "react-native-elements";

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
    showAssets(assets:[Asset]) {
        return (
            <FlatList numColumns={1}
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
    }
    setModalVisible(visible: boolean) {
        this.setState({ modalVisible: visible });
    }
    render() {
        return (
            <Card
                title={this.props.bill.title}
                titleStyle={styles.titleStyle}
                containerStyle={styles.card}
            >
                <Modal
                    animationType="slide"
                    animationIn={'zoomInDown'}
                    animationOut={'zoomOutUp'}
                    animationInTiming={500}
                    animationOutTiming={500}
                    transparent={true}
                    visible={this.state.modalVisible}
                    backdropOpacity={0.3}
                    swipeDirection="left"
                    onSwipe={() => { this.setModalVisible(!this.state.modalVisible) }}
                    onBackdropPress={() => { this.setModalVisible(!this.state.modalVisible) }}
                    onRequestClose={() => console.log('closed')}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPressOut={() => { this.setModalVisible(!this.state.modalVisible) }}
                    >
                        <Text style={styles.modalTitle}> Assets </Text>
                        {this.showAssets(this.props.bill.assets)}
                        <Text style={{ color: 'dodgerblue' }}> Tap to Close </Text>
                    </TouchableOpacity>
                </Modal>
                <View>
                    <TouchableOpacity onPress={() => { this.setModalVisible(!this.state.modalVisible); }} >
                        <View style={{ backgroundColor: 'lightblue', padding: 5, height: 100 }}>
                            <Text> Total Consumed </Text>
                            <Text style={styles.billInfo}>
                                {this.addCommas(this.props.bill.unitRate * this.props.bill.unitsConsumed)}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='watch' color='#00aced' />
                        <Text>{this.props.bill.month}</Text>
                    </View>

                </View>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 15,
        padding: 0,
        flex: 1,
        borderRadius: 20,
    },
    titleStyle: {
        fontSize: 17,
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
        borderRadius: 4,
        borderColor: "#C0C0C0",
        borderWidth: 2,
        marginHorizontal: 40,
        marginVertical: 80,
        flex: 1
    },
    description: {
        padding: 10,
        fontSize: 14,
        width: 100
    },
    modalInside: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
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
        fontSize: 20,
        textAlign:'center',
    }
});