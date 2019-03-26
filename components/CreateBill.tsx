import React from 'react';
import {
    StyleSheet, Text, View, TextInput, Picker, TouchableOpacity, ScrollView, KeyboardAvoidingView
} from 'react-native';
import { Alert, ActivityIndicator } from 'react-native';
//import { Header, Icon, Input, Divider } from 'react-native-elements';

import { compose, graphql } from 'react-apollo';
import { BackHandler, Platform } from 'react-native';
import Asset from './interfaces/IBill';
import Header from './header';
//import mutation query from queries
import { getBillsQuery, addBillMutation } from './queries/queries';
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import * as Yup from 'yup';

export interface Props {
    history?: any
}

enum Site {
    Home,
    Office
}

class CreateBill extends React.Component<any, any>  {
    constructor(props: any) {
        super(props);
        this.state = {
            title: "",
            site: "Home",
            month: "January",
            unitRate: 0.0,
            unitsConsumed: 0.0,
            assets: [],
            loading: false,
            response: null,
        }
        this.submitMutation = this.submitMutation.bind(this);
    }
    //hijacking back button to redirect to home
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
    //resetting form values
    resetState = () => {
        this.setState({
            title: '',
            site: "Home",
            month: "January",
            unitRate: 0,
            unitsConsumed: 0,
            assets: [],
            loading: false,
            response: ''
        })
    }
    //handling changes on assets' properties
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
    //adding and removing assets object(s)
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

    submitMutation = () => {
        return this.props.mutate({
            variables: {
                title: this.state.title,
                site: this.state.site,
                month: this.state.month,
                unitRate: this.state.unitRate,
                unitsConsumed: this.state.unitsConsumed,
                assets: this.state.assets
            },
            refetchQueries: [{ query: getBillsQuery }]
        })
    }

    _handleSubmit = async (values: any, bag: any) => {
        //setting values here, when form is already validated by yup in formika
        this.setState({
            title: values.title,
            unitRate: parseFloat(values.unitRate),
            unitsConsumed: parseFloat(values.unitsConsumed)
        });
        try {
            //set loading to true before sending request
            this.setState({ loading: true });
            bag.setSubmitting(true);
            await this.submitMutation()
                .then(({ data }) => {
                    this.setState({
                        response: "Record Added",
                        loading: false
                    });
                    // clear the form
                    bag.resetForm();
                    bag.setSubmitting(false);
                    // clear the state
                    this.resetState();
                }).catch((error) => {
                    this.setState({ loading: false });
                    bag.setSubmitting(false);
                });
        } catch (error) {
            bag.setSubmitting(false);
            bag.setErrors(error);
        }
    }

    renderForm = (formikProps) => {
        const {
            values, handleSubmit, handleChange, setFieldValue, errors,
            touched, setFieldTouched, isValid, isSubmitting
        } = formikProps;

        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior="position"
                    enabled={true}
                >
                    <React.Fragment>
                        <View>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}> Create Bill </Text>
                                <View style={{ height: 10 }}></View>
                            </View>
                            {/* first row of title */}
                            <View style={{justifyContent: Platform.OS=="web"?'space-evenly':'space-between'}}>
                                <View>
                                    <Text style={styles.fieldTitle}> Title * </Text>
                                </View>
                                <View style={{ flexDirection: 'row', padding: Platform.OS=="web"?10:1}}>
                                    <Text>Icon</Text>
                                    <TextInput placeholder="title goes here"
                                        onChangeText={handleChange('title')}
                                    />
                                </View>
                                <Text style={styles.textInfo}>Required</Text>
                            </View>

                            {/* second row of form fileds: Pickers for Site and Month */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ marginTop: 20 }}>
                                    <View>
                                        <View>
                                            <Text style={styles.fieldTitle}> Site * </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', padding: 0, margin: 0, alignItems: 'center' }}>
                                            <Text> Icon </Text>
                                            <View style={{ width: 110 }}>
                                                <Picker selectedValue={this.state.site} onValueChange={
                                                    (itemValue, itemIndex) => {
                                                        this.setState({ site: itemValue });
                                                    }
                                                }>
                                                    <Picker.Item label="Home" value="Home" />
                                                    <Picker.Item label="Office" value="Office" />
                                                </Picker>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <View>
                                        <View>
                                            <Text style={styles.fieldTitle}> Month * </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', padding: 0, margin: 0, alignItems: 'center' }}>
                                            <Text>Icon</Text>
                                            <View style={{ width: 130 }}>
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
                            </View>

                            {/* Third row of unit rate and units consumed */}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ marginTop: 20 }}>
                                    <View>
                                        <View>
                                            <Text style={styles.fieldTitle}> Unit Rate * </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', padding: 0, margin: 0, alignItems: 'center' }}>
                                            <Text>Icon</Text>
                                            <View style={{ width: 110 }}>
                                                <TextInput placeholder="unit rate"
                                                    onChangeText={handleChange('unitRate')}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <View>
                                        <View>
                                            <Text style={styles.fieldTitle}> Units Consumed * </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', padding: 0, margin: 0, alignItems: 'center'}}>
                                            <Text></Text>
                                            <View style={{ width: 130 }}>
                                                <TextInput placeholder="units consumed"
                                                    onChangeText={handleChange('unitsConsumed')}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* third row of dynamimc assets */}
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                {this.state.assets.length ? this.state.assets.map((asset, idx) => (
                                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, padding: 5 }}>
                                        <Text style={{ color: '#39F' }}>{`Asset #${idx + 1}`}</Text>
                                        <View style={styles.assetField}>
                                            <TextInput
                                                placeholder={`device`}
                                                onChangeText={(text) => { this.handleAssetDeviceChange(idx, text) }}
                                            />
                                        </View>
                                        <View style={styles.assetField}>
                                            <TextInput
                                                placeholder={` company`}
                                                onChangeText={(text) => { this.handleAssetCompanyChange(idx, text) }}
                                            />
                                        </View>
                                        <View style={styles.assetField}>
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
                                ))
                                    : <Text style={styles.assetPrompt}>Tap to Add Assets</Text> //else show text
                                }
                                <TouchableOpacity style={styles.addButton} onPress={() => { this.handleAddAsset() }}>
                                    <Text style={{ color: 'white', fontSize: 16 }}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </React.Fragment>
                </KeyboardAvoidingView>

                <View style={{ justifyContent: 'flex-start', marginLeft: '75%' }}>
                    <TouchableOpacity style={(!isValid || isSubmitting) ? styles.disabledButton : styles.button}
                        // disabled={!isValid || isSubmitting}
                        onPress={handleSubmit} >
                        <Text style={{ fontSize: 16, color: (!isValid || isSubmitting) ? 'darkgray' : '#39F' }}> Next </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    render() {
        const backSign: String = "<-Home";
        return (
            <View style={{ flex: 1}}>
                <Header />
                {/* add or remove contents based on loading and error response from mutation  */}
                {this.state.loading && (
                    <View style={styles.mutationResponse}>
                        <ActivityIndicator
                            style={{ height: 80 }}
                            color="#C00"
                            size="large"
                        />
                    </View>
                )}

                <View style={Platform.OS=="web"?styles.webContainer: styles.container}>

                    <Formik
                        initialValues={{ title: '', site: '', unitRate: 0, unitsConsumed: 0 }}
                        onSubmit={this._handleSubmit}
                        render={this.renderForm}
                        validationSchema={Yup.object().shape({
                            title: Yup
                                .string()
                                .required('title is required'),
                            unitRate: Yup
                                .number()
                                .positive('not positive')
                                .required('required'),
                            unitsConsumed: Yup
                                .number()
                                .positive('not positive')
                                .required('required')
                        })}
                    >

                    </Formik>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        justifyContent: 'center',
    },
    webContainer:{
        backgroundColor:'aliceblue',
        width:"60%",
        alignItems:'center',
        marginLeft: 230,
        padding: 10,
        flex: 1,
    },
    titleContainer: {
        padding: 10,
    },
    title: {
        fontSize: 16,
        color: '#212121'
    },
    button: {
        width: 120,
        padding: 10,
        margin: 10,
    },
    disabledButton: {
        width: 120,
        padding: 10,
        margin: 10,
    },
    fieldContainer: {
        borderBottomColor: '#39F',
        borderBottomWidth: 1,
        flex: 1,
    },
    fieldTitle: {
        fontSize: 12,
        color: '#39F',
        marginLeft: 30,
        marginBottom: -5
    },
    textInfo: {
        fontSize: 10,
        color: 'darkgrey'
    },
    assetPrompt: {
        fontSize: 12,
        color: '#39F',
    },
    field: {
        height: 60,
        paddingLeft: 6,
        padding: 2,
        fontSize: 16
    },
    assetField: {
        width: 80,
    },
    deleteButton: {
        backgroundColor: '#39F',
        borderRadius: 20,
        overflow: 'hidden',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40, height: 40,
    },
    addButton: {
        backgroundColor: '#39F',
        borderRadius: 20,
        overflow: 'hidden',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40, height: 40,
        marginTop: 5
    },
    mutationResponse: {
        backgroundColor: 'lightgray',
        borderRadius: 10,
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center'
    }
});

export default graphql(addBillMutation)(CreateBill);