import React from 'react';
import {
    StyleSheet, Text, View, TextInput, Picker, TouchableOpacity, ScrollView, KeyboardAvoidingView
} from 'react-native';
import { Alert, ActivityIndicator } from 'react-native';
import { compose, graphql } from 'react-apollo';
import { Header, Icon, Input } from 'react-native-elements';
import { BackHandler, Platform } from 'react-native';
import Asset from './interfaces/IBill';
//import mutation query from queries
import { getBillsQuery, addBillMutation } from './queries/queries';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputField from './input';

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
            values, handleSubmit, setFieldValue, errors,
            touched, setFieldTouched, isValid, isSubmitting
        } = formikProps;

        return (
            <KeyboardAwareScrollView
                enableOnAndroid
                enableAutomaticScroll
                keyboardOpeningTime={0}
                extraHeight={Platform.select({ android: 200 })}
            >
                <React.Fragment>
                    <View>
                        <View>
                            <View style={{ flexDirection: 'row', padding: 0, margin: 0 }}>
                                <Icon name='heartbeat' type='font-awesome' color='#f50' />
                                <InputField
                                    label="Title"
                                    labelStyle={styles.fieldTitle}
                                    name="title"
                                    placeholder="title goes here"
                                    value={values.title}
                                    onChange={setFieldValue}
                                    onTouch={setFieldTouched}
                                    error={touched.title && errors.title}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.fieldTitle}> Site </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name='heartbeat' type='font-awesome' color='#f50' />
                                    <View style={{ width: 100 }}>
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
                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.fieldTitle}> Month </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name='home' type='font-awesome' color='#dae' />
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

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginTop: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Icon name='heartbeat' type='font-awesome' color='#f50' />
                                <InputField
                                    label="Unit Rate"
                                    labelStyle={styles.fieldTitle}
                                    name="unitRate"
                                    keyboardType="numeric"
                                    placeholder="Unit Rate"
                                    value={values.unitRate}
                                    onChange={setFieldValue}
                                    onTouch={setFieldTouched}
                                    error={touched.unitRate && errors.unitRate}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Icon name='heartbeat' type='font-awesome' color='#f50' />
                                <InputField
                                    label="Units Consumed"
                                    labelStyle={styles.fieldTitle}
                                    name="unitsConsumed"
                                    keyboardType="numeric"
                                    placeholder="Units Consumed"
                                    value={values.unitsConsumed}
                                    onChange={setFieldValue}
                                    onTouch={setFieldTouched}
                                    error={touched.unitsConsumed && errors.unitsConsumed}
                                />
                            </View>

                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 12 }}>
                            {this.state.assets.length? this.state.assets.map((asset, idx) => (
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
                            ))
                        : <Text style={styles.fieldTitle}> Tap to Add Assets </Text>}
                            <TouchableOpacity style={styles.addButton} onPress={() => { this.handleAddAsset() }}>
                                <Text style={{ color: 'white', fontSize: 16 }}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            <TouchableOpacity style={(!isValid || isSubmitting) ? styles.disabledButton : styles.button}
                                disabled={!isValid || isSubmitting}
                                onPress={handleSubmit} >
                                <Text style={{ color: (!isValid || isSubmitting) ? 'darkgray' : 'white' }}> Next </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </React.Fragment>
            </KeyboardAwareScrollView>
        );
    }
    render() {
        const backSign: String = "<-Home";
        return (
            <View style={{ flex: 1 }}>
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
                <Header placement="left"
                    leftComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.history.push('/') }}
                    centerComponent={{ text: 'Create Bill', style: { color: '#fff' } }}
                />

                <View style={styles.container}>

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
                                .positive()
                                .required('required'),
                            unitsConsumed: Yup
                                .number()
                                .positive()
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
    },
    button: {
        width: 120,
        alignItems: 'center',
        backgroundColor: 'dodgerblue',
        padding: 10,
        borderRadius: 20,
        textAlign: 'center',
        margin: 10
    },
    disabledButton: {
        width: 120,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 20,
        textAlign: 'center',
        margin: 10
    },
    fieldContainer: {
        borderBottomColor: 'dodgerblue',
        borderBottomWidth: 1,
        flex: 1,
    },
    fieldTitle: {
        fontSize: 10,
        color: 'dodgerblue',
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
    mutationResponse: {
        backgroundColor: 'lightgray',
        borderRadius: 10,
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center'
    }
});

export default graphql(addBillMutation)(CreateBill);