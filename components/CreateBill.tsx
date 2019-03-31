import React from 'react';
import {
    StyleSheet, Text, Image, View, TextInput, Picker, TouchableOpacity, ScrollView, KeyboardAvoidingView
} from 'react-native';
import { ActivityIndicator } from 'react-native';
import { BackHandler, Platform } from 'react-native';
import Header from './header';

import { graphql } from 'react-apollo';
//import mutation query from queries
import { getBillsQuery, addBillMutation } from './queries/queries';
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
            response: "Record Added",
            loading: false
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
            assets: this.state.assets.concat([{ device: "", company: "", power: null }])
        });
    };
    handleRemoveAsset = (idx: number) => {
        this.setState({
            assets: this.state.assets.filter((asset, assetIdx) => idx != assetIdx)
        });
    };
    filterAssets = () => {
        let assets = [...this.state.assets];
        let newAssets = assets.filter(asset => {
            return (asset.device != "" && asset.company != "" && asset.power != null)
        })
        this.setState({ assets: newAssets });
    }

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
        this.filterAssets();
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
                    this.resetState();
                    bag.resetForm();
                    bag.setSubmitting(false);
                }).catch((error) => {
                    this.setState({ loading: false });
                    bag.setSubmitting(false);
                });
        } catch (error) {
            bag.setSubmitting(false);
            bag.setErrors(error);
        }
    }

    renderForm = (formikProps: any) => {
        const {
            values, handleSubmit, handleBlur, handleChange, errors,
            touched, isValid, isSubmitting
        } = formikProps;

        return (

            <View style={{ flex: 1 }}>
                <ScrollView>
                    <KeyboardAvoidingView
                        behavior="position"
                        enabled={true}
                    >
                        <React.Fragment>
                            <View style={styles.mainContainer}>
                                {/* {this.showTitleForWeb} */}
                                {/* first row of title */}
                                <View style={styles.firstRow}>
                                    <View>
                                        <Text style={styles.fieldTitle}> Title * </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image style={styles.icon} source={require('../assets/icons/title.png')} />
                                        <TextInput
                                            style={styles.input}
                                            value={values.title}
                                            placeholder="title goes here"
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
                                <View style={styles.secondRowContainer}>
                                    <View style={styles.secondRow}>

                                        <View style={styles.rowContainer}>
                                            <View style={styles.innerRow}>
                                                <View style={styles.siteContainer}>
                                                    <Text style={styles.fieldTitle}> Site  </Text>
                                                </View>
                                                <View style={styles.siteIconContainer}>
                                                    <Image style={styles.siteIcon} source={require('../assets/icons/site.png')} />
                                                    <View style={styles.sitePickerContainer}>
                                                        <Picker
                                                            selectedValue={this.state.site}
                                                            onValueChange={
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

                                        <View style={styles.monthContainer}>
                                            <View>
                                                <View style={styles.monthRow}>
                                                    <Text style={styles.fieldTitle}> Month </Text>
                                                </View>
                                                <View style={styles.monthIconPicker}>
                                                    <Image style={styles.icon} source={require('../assets/icons/calendar.png')} />
                                                    <View style={styles.monthPickerContainer}>
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
                                <View style={styles.thirdRowContainer}>
                                    <View style={styles.thirdRowRate}>
                                        <View>
                                            <Text style={styles.fieldTitle}> Unit Rate *</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Image style={styles.icon} source={require('../assets/icons/unit.png')} />
                                            <TextInput keyboardType='numeric'
                                                value={values.unitRate.toString()}
                                                style={styles.unitRate}
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

                                    <View style={styles.thirdRowConsumed}>
                                        <View>
                                            <Text style={styles.fieldTitle}> Units Consumed *</Text>
                                        </View>
                                        <View style={styles.consumedIconInputContainer}>
                                            <Image style={styles.icon} source={require('../assets/icons/unitsConsumed.png')} />
                                            <TextInput
                                                value={values.unitsConsumed.toString()}
                                                keyboardType='numeric'
                                                style={styles.unitsConsumed}
                                                placeholder="units consumed"
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
                                <View style={styles.fourthRowContainer}>
                                    {this.state.assets.length ? this.state.assets.map((asset, idx) => (
                                        <View key={idx} style={styles.assetRow}>
                                            <Text style={styles.assetText}>{`Asset #${idx + 1} `}</Text>
                                            <View style={styles.assetField}>
                                                <TextInput
                                                    placeholder={`device`}
                                                    onChangeText={(text) => { this.handleAssetDeviceChange(idx, text) }}
                                                />
                                            </View>
                                            <View style={styles.assetField}>
                                                <TextInput
                                                    placeholder={`company`}
                                                    onChangeText={(text) => { this.handleAssetCompanyChange(idx, text) }}
                                                />
                                            </View>
                                            <View style={styles.assetField}>
                                                <TextInput
                                                    placeholder={`power`}
                                                    keyboardType='numeric'
                                                    onChangeText={(text) => { this.handleAssetPowerChange(idx, parseFloat(text)) }}
                                                />
                                            </View>

                                            <TouchableOpacity style={styles.deleteButton} onPress={() => { this.handleRemoveAsset(idx) }}>
                                                <Text style={{ color: 'white', fontSize: 16 }}>-</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                        : <Text style={styles.assetPrompt}>Tap to Add Assets</Text>
                                    }
                                    <TouchableOpacity style={styles.addButton} onPress={() => { this.handleAddAsset() }}>
                                        <Text style={{ color: 'white', fontSize: 16 }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </React.Fragment>
                    </KeyboardAvoidingView>
                </ScrollView>

                <View style={styles.bottomDivider}>
                    <View style={{ justifyContent: 'flex-start', marginTop: '0%', marginLeft: '75%' }}>
                        <TouchableOpacity
                            style={(!isValid || isSubmitting) ? styles.disabledButton : styles.button}
                            disabled={!isValid || isSubmitting}
                            onPress={handleSubmit} >
                            <Text style={{ fontSize: 16, color: (!isValid || isSubmitting) ? 'darkgray' : '#39F' }}> Next </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
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
                        initialValues={{ title: '', unitRate: 0, unitsConsumed: 0 }}
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
    firstRow: {
        marginLeft: Platform.OS == "web" ? - 11 : 0,
        justifyContent: Platform.OS == "web" ? 'space-evenly' : 'space-between'
    },
    secondRowContainer: {
        marginLeft: Platform.OS == "web" ? '-14.7%' : 0,
        marginTop: Platform.OS == "web" ? 0 : 0
    },
    secondRow: {
        flexDirection: 'row',
        marginTop: Platform.OS == "web" ? 0 : 15
    },
    siteContainer: {
        marginLeft: Platform.OS != "web" ? 3 : 0,
        marginBottom: Platform.OS != "web" ? -5 : 0
    },
    siteIconContainer: {
        flexDirection: 'row',
        padding: 0,
        margin: 0,
        alignItems: 'center'
    },
    siteIcon: {
        height: 25,
        width: 20
    },
    sitePickerContainer: {
        width: 110,
        marginLeft: Platform.OS == "web" ? 12 : 9
    },
    monthContainer: {
        marginTop: Platform.OS == "web" ? 20 : 0,
        marginLeft: Platform.OS == "web" ? 0 : 20,
    },
    monthRow: {
        marginBottom: Platform.OS != "web" ? -5 : 0
    },
    monthIconPicker: {
        flexDirection: 'row',
        padding: 0,
        margin: 0,
        alignItems: 'center'
    },
    monthPickerContainer: {
        width: 130,
        marginLeft: Platform.OS == "web" ? 12 : 8
    },
    thirdRowContainer: {
        flexDirection: 'row',
        marginTop: Platform.OS != "web" ? 15 : 30,
    },
    thirdRowRate: {
        width: '40%',
        marginLeft: Platform.OS == "web" ? -10 : 0
    },
    unitRate: {
        padding: Platform.OS == "web" ? 5 : 2,
        marginLeft: Platform.OS == "web" ? 9 : 13,
        width: Platform.OS == "web" ? "50%" : "67%"
    },
    thirdRowConsumed: {
        width: '53%',
        marginLeft: Platform.OS == "web" ? 18 : 47,
    },
    consumedIconInputContainer: {
        flexDirection: 'row'
    },
    unitsConsumed: {
        padding: Platform.OS == "web" ? 5 : 2,
        marginLeft: Platform.OS == "web" ? 7 : 13,
        width: Platform.OS != "web" ? "75%" : "50%"
    },
    fourthRowContainer: {
        alignItems: 'center',
        width: Platform.OS != "web" ? '80%' : 'auto',
        marginTop: 20,
        marginLeft: Platform.OS == "web" ? '-27%' : '10%'
    },
    assetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: Platform.OS == "web" ? '5%' : '0%',
        marginTop: 10,
        padding: 5
    },
    assetField: {
        width: Platform.OS == "web" ? 86 : 70,
    },
    assetText: {
        color: '#39F'
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
        marginTop: Platform.OS == "web" ? "1.7%" : 0
    },
    field: {
        height: 60,
        paddingLeft: 6,
        padding: 2,
        fontSize: 16
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
    },
    bottomDivider: {
        width: Platform.OS == "web" ? '77%' : '100%',
        marginTop: Platform.OS == "web" ? '6%' : '0%',
        borderWidth: 1,
        borderTopColor: '#39F',
        borderLeftColor: 'white',
        borderBottomColor: 'white',
        borderRightColor: 'white',
    }
});

export default graphql(addBillMutation)(CreateBill);