import React from 'react';
import {
    StyleSheet, Text, Image, View, TextInput, Picker, TouchableOpacity, ScrollView, KeyboardAvoidingView
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
        console.disableYellowBox = true;
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick = () => {
        this.props.history.push('/');
        return true;
    }
    showTitleForWeb = () => {
        if (Platform.OS == "web") {
            return (
                <View >
                    <Text style={styles.title}> Create Bill </Text>
                    <View style={{ height: 10 }}></View>
                </View>
            );
        } else return (
            <View> </View>
        )
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
            values, handleSubmit, handleBlur, handleChange, setFieldValue, errors,
            touched, setFieldTouched, isValid, isSubmitting
        } = formikProps;

        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior="position"
                    enabled={true}
                >
                    <React.Fragment>
                        <View style={styles.mainContainer}>
                            {/* {this.showTitleForWeb} */}
                            {/* first row of title */}
                            <View style={{ marginLeft: Platform.OS == "web" ? - 11 : 0, justifyContent: Platform.OS == "web" ? 'space-evenly' : 'space-between' }}>
                                <View>
                                    <Text style={styles.fieldTitle}> Title * </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.icon} source={require('../assets/icons/title.png')} />
                                    <TextInput style={styles.input} placeholder="title goes here"
                                        onChangeText={handleChange('title')}
                                        onBlur={handleBlur('title')}
                                    />
                                </View>
                                <Text style={
                                    (touched.title && errors.title) ? styles.errorTextInfo : styles.textInfo
                                }>
                                    {(touched.title && errors.title) ? touched.title && errors.title : "Required"}
                                </Text>
                            </View>

                            {/* second row of form fileds: Pickers for Site and Month */}
                            <View style={{ marginLeft: Platform.OS == "web" ? -71 : 0, marginTop: Platform.OS == "web" ? 0 : 0 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: Platform.OS == "web" ? 0 : 15
                                }}>

                                    <View style={styles.rowContainer}>
                                        <View style={styles.innerRow}>
                                            <View style={{ marginLeft: Platform.OS != "web" ? 3 : 0, marginBottom: Platform.OS != "web" ? -5 : 0 }}>
                                                <Text style={styles.fieldTitle}> Site  </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', padding: 0, margin: 0, alignItems: 'center' }}>
                                                <Image style={{ height: 25, width: 20 }} source={require('../assets/icons/site.png')} />
                                                <View style={{ width: 110, marginLeft: Platform.OS == "web" ? 12 : 9 }}>
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

                                    <View style={{ marginTop: Platform.OS == "web" ? 20 : 0 }}>
                                        <View>
                                            <View style={{ marginBottom: Platform.OS != "web" ? -5 : 0 }}>
                                                <Text style={styles.fieldTitle}> Month </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', padding: 0, margin: 0, alignItems: 'center' }}>
                                                <Image style={styles.icon} source={require('../assets/icons/calendar.png')} />
                                                <View style={{ width: 130, marginLeft: Platform.OS == "web" ? 12 : 8 }}>
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
                            </View>

                            {/* Third row of unit rate and units consumed */}
                            <View style={{ flexDirection: 'row', marginLeft: Platform.OS == "web" ? -3 : 0, marginTop: Platform.OS != "web" ? 15 : 30 }}>
                                <View style={{ width: '40%', marginLeft: Platform.OS == "web" ? -10 : 0 }}>
                                    <View>
                                        <Text style={styles.fieldTitle}> Unit Rate *</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Image style={styles.icon} source={require('../assets/icons/unit.png')} />
                                        <TextInput keyboardType='numeric'
                                            value={values.unitRate.toString()}
                                            style={{
                                                padding: Platform.OS == "web" ? 5 : 2,
                                                marginLeft: Platform.OS == "web" ? 11 : 13,
                                                width: Platform.OS == "web" ? "50%" : "67%"
                                            }}
                                            placeholder="unit rate"
                                            onChangeText={handleChange('unitRate')}
                                            onBlur={handleBlur('unitRate')}
                                        />
                                    </View>
                                    <Text style={
                                        (touched.unitRate && errors.unitRate) ? styles.errorTextInfo : styles.textInfo
                                    }>
                                        {(touched.unitRate && errors.unitRate) ? touched.unitRate && errors.unitRate : "Required"}
                                    </Text>
                                </View>

                                <View style={{ width: '53%', marginLeft: Platform.OS == "web" ? 17 : 26 }}>
                                    <View>
                                        <Text style={styles.fieldTitle}> Units Consumed *</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image style={styles.icon} source={require('../assets/icons/unitsConsumed.png')} />
                                        <TextInput
                                            value={values.unitsConsumed.toString()}
                                            keyboardType='numeric'
                                            style={{
                                                padding: Platform.OS == "web" ? 5 : 2,
                                                marginLeft: Platform.OS == "web" ? 5 : 13,
                                                width: Platform.OS != "web" ? "67%" : "50%"
                                            }} placeholder="units consumed"
                                            onChangeText={handleChange('unitsConsumed')}
                                            onBlur={handleBlur('unitsConsumed')}
                                        />
                                    </View>
                                    <Text style={
                                        (touched.unitsConsumed && errors.unitsConsumed) ? styles.errorTextInfo : styles.textInfo
                                    }>
                                        {(touched.unitsConsumed && errors.unitsConsumed) ? touched.unitsConsumed && errors.unitsConsumed : "Required"}
                                    </Text>
                                </View>

                            </View>

                            {/* fourth row of dynamimc assets */}
                            <View style={{ alignItems: 'center', marginTop: 20, marginLeft: Platform.OS == "web" ? '-20%' : 0 }}>
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
            <View style={{ flex: 1 }}>
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

                <View style={Platform.OS == "web" ? styles.webContainer : styles.container}>

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
                                .required('Required')
                                .positive('not positive')
                                .integer('not a number')
                                .typeError('not a number'),
                            unitsConsumed: Yup
                                .number()
                                .required('Required')
                                .positive('not a positive')
                                .integer('not a number')
                                .typeError('not a number'),
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
    mainContainer: {
        padding: 10
    },
    webContainer: {
        justifyContent: 'center',
        width: "40%",
        alignItems: 'center',
        marginLeft: '35%',
        padding: 10,
        flex: 1,
    },
    newRow: {
        flexDirection: 'row',
        marginTop: Platform.OS == "web" ? 0 : 8,
        justifyContent: 'space-between'
    },
    rowContainer: {
        width: '50%',
        justifyContent: Platform.OS == "web" ? 'space-evenly' : 'space-between',
        flexDirection: 'row',
        marginLeft: Platform.OS == "web" ? -3.5 : -3.5,
    },
    innerRow: {
        marginTop: Platform.OS == "web" ? 20 : 0,
        marginLeft: Platform.OS == "web" ? -0.5 : 0
    },
    title: {
        fontSize: 16,
        color: '#212121'
    },
    input: {
        padding: Platform.OS == "web" ? 5 : 2,
        marginLeft: Platform.OS == "web" ? 7 : 12
    },
    icon: {
        padding: Platform.OS == "web" ? 10 : 0,
        height: 20, width: 20
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
        marginLeft: Platform.OS == "web" ? 25 : 33,
        padding: Platform.OS == "web" ? 5 : 0,
        marginBottom: -5
    },
    textInfo: {
        fontSize: 10,
        color: 'darkgrey',
        marginTop: Platform.OS == "web" ? 0 : -5,
        marginLeft: Platform.OS == "web" ? 32 : 35
    },
    errorTextInfo: {
        fontSize: 10,
        color: 'red',
        marginTop: Platform.OS == "web" ? 0 : -5,
        marginLeft: Platform.OS == "web" ? 32 : 35
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