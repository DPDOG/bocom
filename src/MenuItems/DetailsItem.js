import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    I18nManager, AsyncStorage,
    KeyboardAvoidingView,
    Keyboard
} from "react-native";
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { ScrollView } from "react-native-gesture-handler";
import { GlobalVariables } from "../GlobalVariables"


let allInfo = [];
let startPrice = null;

import localeStrings from '../../res/strings/LocaleStrings';
import StyleSheetFactory from "../../res/styles/LocaleStyles";
import Modal from "react-native-modal";
import { GoogleSignin } from "react-native-google-signin";

const styles = StyleSheetFactory.getSheet(I18nManager.isRTL);

export default class DetailsItem extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.state.params.productType,
            headerStyle: {
                backgroundColor: '#26466c',
                borderBottomWidth: 0,
                shadowColor: "transparent",
                elevation: 0,
                shadowOpacity: 0,


            },

            headerRight: (<View />),
            headerLeft: (
                <TouchableOpacity onPress={() => {
                    GlobalVariables.dressings.id = null;
                    GlobalVariables.extraDressings.id = null;
                    navigation.goBack(null)
                }} style={styles.headerBackButton}>
                    <Image style={{
                        resizeMode: "contain",
                        width: 15,
                        height: 15,
                        marginBottom: 5,
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]
                    }}
                        source={require('../../res/images/back.png')} />
                </TouchableOpacity>
            ),
            headerTintColor: '#fff',
            headerTitleStyle: {
                textAlign: "center",
                flex: 1,
                alignSelf: "center",
                color: 'white',
                fontSize: 17,
            },

        }
    };

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            quantity: 1,
            detailsItem: [],
            itemPrice: 0,
            itemQuantity: 0,
            statusInstructions: false,
            inputOn: false,
            text: "",
            IsCheckinModalVisible: false,
            isCheckIn: false,
            toScroll: false,
            scrollMarginTop: '0%',
            specialInstructions: null,

        };
        allInfo = this.params.productData;

    }


    showInstructions() {
        return (
            <View style={{ height: 45, width: "100%", marginLeft: 15, borderColor: "red", borderWidth: 2 }}>
                <TextInput style={{ fontFamily: "Helvetica", fontSize: 14 }}
                    placeholder="Instructions"
                    placeholderTextColor="#9b9b9b" />
            </View>
        )
    }

    componentWillMount() {
        startPrice = allInfo.price;
        this.setState({
            detailsItem: allInfo,
            itemQuantity: 1,
            itemPrice: allInfo.price,
            restCurrencyCode: allInfo.restCurrencyCode,
            statusInstructions: false,
        });
    }

    componentDidMount() {
        this.showCheckIn();
        let that = this;
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            that.setState({ toScroll: true, scrollMarginTop: -e.endCoordinates.height });
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            that.setState({ toScroll: false, scrollMarginTop: '0%' });
        });
    }

    showCheckIn() {
        AsyncStorage.getItem('checkIn').then((value) => {
            if (value === "true") {
                this.setState({ isCheckIn: true });
                AsyncStorage.getItem('restCurrCode').then((value) => {
                    GlobalVariables.restCurrencyCode.value = value;
                }).done();
            } else {
                this.setState({ isCheckIn: false })

            }
        }).done();
    }



    quantityAdd() {

        let numberAdd = this.state.itemQuantity + 1;

        this.setState({
            itemQuantity: numberAdd,
            itemPrice: startPrice * numberAdd


        })
    }

    quantityMinus() {
        if (this.state.itemQuantity === 1) {

            this.setState({
                itemQuantity: 1,
                itemPrice: startPrice


            })
        } else {
            let numberMinus = this.state.itemQuantity - 1;

            this.setState({
                itemQuantity: numberMinus,
                itemPrice: startPrice * numberMinus
            })
        }

    }

    addItemInMenu() {

        GlobalVariables.orders.push({
            info: this.state.detailsItem,
            quantity: this.state.itemQuantity,
            rawPrice: Number(allInfo.price),
            price: Number(this.state.itemPrice),
            dressing: false,
            extraDressing: false,
            specialInstructions: this.state.specialInstructions
        });

        if (GlobalVariables.dressings.id !== null) {
            GlobalVariables.orders.push({
                info: {
                    id: GlobalVariables.dressings.id,
                    name: GlobalVariables.dressings.name,
                    image: GlobalVariables.dressings.image,
                    description: "Dressing"
                },
                quantity: 1,
                rawPrice: Number(0),
                price: Number(0),
                dressing: true,
                extraDressing: false,
            });
            GlobalVariables.totalOrders.value += 1;
        }

        if (GlobalVariables.extraDressings.id !== null) {

            GlobalVariables.orders.push({
                info: {
                    id: GlobalVariables.extraDressings.id,
                    name: GlobalVariables.extraDressings.name,
                    image: GlobalVariables.extraDressings.image,
                    description: "Extra dressing"
                },
                quantity: 1,
                rawPrice: Number(GlobalVariables.extraDressings.price),
                price: Number(GlobalVariables.extraDressings.price),
                dressing: false,
                extraDressing: true,
            });
            GlobalVariables.totalOrders.value += 1;
        }

        GlobalVariables.totalOrders.value += 1;
        GlobalVariables.dressings.id = null;
        GlobalVariables.extraDressings.id = null;

        AsyncStorage.setItem("savedOrders", JSON.stringify(GlobalVariables.orders));

        this.props.navigation.navigate("MenuSlider", { name: "MenuSlider" })

    }


    render() {

        if (this.state.detailsItem.extras.length >= 1) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: "column"
                }}>
                    <ScrollView scrollEnabled={this.state.toScroll} style={{ width: "100%", height: "100%" }} keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled">
                        <View style={{ flex: 1, marginBottom: 10, marginTop: this.state.scrollMarginTop }}>
                            <View style={styles.ViewImage}>
                                <Image style={styles.imageItem} source={{ uri: this.state.detailsItem.image }} />
                            </View>

                            <View style={{ flexDirection: "row", marginLeft: 15 }}>

                                <View style={{ flexDirection: "column", width: "100%" }}>
                                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontFamily: "Helvetica",
                                                textAlign: 'center',
                                                width: "50%"
                                            }}>{this.state.detailsItem.name}</Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontFamily: "Helvetica",
                                                textAlign: 'center',
                                                width: "50%"
                                            }}>{I18nManager.isRTL ? <Text>₪ {this.state.itemPrice.toFixed(2)} </Text>
                                                : <Text>{this.state.restCurrencyCode} {this.state.itemPrice.toFixed(2)} {GlobalVariables.restCurrencyCode.value}</Text>}</Text>
                                    </View>
                                    <Text style={{
                                        fontSize: 14,
                                        fontFamily: "Helvetica",
                                        marginTop: 8,
                                        textAlign: 'left',
                                    }}>{this.state.detailsItem.description}</Text>
                                </View>

                            </View>

                            <View style={{
                                backgroundColor: "#D8D8D8",
                                height: 35,
                                marginTop: 12,
                                justifyContent: "center",

                            }}>

                                <Text style={{
                                    color: "black",
                                    marginLeft: 15,
                                    fontFamily: "Helvetica",
                                    fontSize: 12,
                                    textAlign: 'left'
                                }}>{this.params.productType}</Text>

                            </View>

                            <View style={{
                                flexDirection: "row",
                                height: 45,
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginLeft: 15
                            }}>

                                <Text style={styles.TextCriteria}>{localeStrings.detailItemsStrings.quantity}</Text>
                                <View style={{
                                    flexDirection: "row",
                                    height: 45,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 15
                                }}>

                                    <TouchableOpacity onPress={() => this.quantityMinus()} style={{
                                        height: 45,
                                        width: 45,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <View style={{
                                            height: 35,
                                            width: 45,
                                            borderColor: "black",
                                            borderWidth: 0.5,
                                            borderRadius: 7,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <Text>-</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 8, marginRight: 8 }}>{this.state.itemQuantity}</Text>

                                    <TouchableOpacity onPress={() => this.quantityAdd()} style={{
                                        height: 45,
                                        width: 45,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <View style={{
                                            marginLeft: 8,
                                            marginRight: 8,
                                            height: 35,
                                            width: 45,
                                            borderColor: "black",
                                            borderWidth: 0.5,
                                            borderRadius: 7,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <Text>+</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>


                            <View style={styles.BorderViewItem} />

                            <TouchableOpacity style={styles.TouchableCriteria} onPress={() => {
                                this.props.navigation.navigate("Dressing", {
                                    name: "Dressing",
                                    typeDressing: this.params.productType,
                                    dressingData: allInfo.extras,
                                    choiceDressing: true
                                })
                            }}>
                                <View style={styles.ViewCriteria}>
                                    <Text
                                        style={styles.TextCriteria}>{localeStrings.detailItemsStrings.choiceOfDressing}</Text>
                                    <Image
                                        style={[styles.ImgViewCriteria, { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }], }]}
                                        source={require('../../res/images/rightArrow.png')} />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.BorderView} />

                            <TouchableOpacity style={styles.TouchableCriteria} onPress={() => {
                                this.props.navigation.navigate("Dressing", {
                                    name: "Dressing",
                                    typeDressing: this.params.productType,
                                    dressingData: allInfo.extras,
                                    choiceDressing: false
                                })
                            }}>
                                <View style={styles.ViewCriteria}>
                                    <Text
                                        style={styles.TextCriteria}>{localeStrings.detailItemsStrings.extraDressing}</Text>
                                    <Image
                                        style={[styles.ImgViewCriteria, { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }], }]}
                                        source={require('../../res/images/rightArrow.png')} />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.BorderView} />

                            <TouchableOpacity style={styles.TouchableCriteria} onPress={() => {

                                if (this.state.inputOn === true) {
                                    this.setState({
                                        inputOn: false
                                    })
                                } else {
                                    this.setState({
                                        inputOn: true
                                    })
                                }

                            }}><View style={styles.ViewCriteria}>

                                    <Text
                                        style={styles.TextCriteria}>{localeStrings.detailItemsStrings.specialInstructions}</Text>
                                    {this.state.inputOn ? <Image style={[styles.ImgViewCriteria, { tintColor: '#000000' }]}
                                        source={require('../../res/images/close.png')} /> : <Image style={styles.ImgViewCriteria}
                                            source={require('../../res/images/plus.png')} />}
                                </View>
                            </TouchableOpacity>
                            {this.state.inputOn
                                ? <KeyboardAvoidingView>
                                    <View style={{ height: 80, marginRight: 20, marginLeft: 20, backgroundColor: "#D8D8D8", marginBottom: 8 }}>
                                        <TextInput style={{ height: 80, color: "black", width: "95%", marginLeft: 15, marginRight: 20 }}
                                            multiline={true}
                                            onChangeText={(specialInstructions) => this.setState({ specialInstructions })}
                                            value={this.state.specialInstructions}></TextInput>
                                    </View>
                                </KeyboardAvoidingView>
                                : null}
                            <View style={styles.BorderView} />
                        </View>
                    </ScrollView>
                    <View style={{
                        marginBottom: 0,
                        height: 45,
                        width: "100%",
                        backgroundColor: "#004C6C",
                        justifyContent: "flex-end",
                        alignItems: "center",

                    }}>
                        <TouchableOpacity onPress={() => {
                            AsyncStorage.getItem('savedBarId').then((savedBarId) => {
                                if (savedBarId == this.params.barId) {
                                    this.addItemInMenu()
                                } else {
                                    this.setState({ IsCheckinModalVisible: true });
                                }
                            }).done();
                        }} style={{
                            height: 45,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Text style={{ color: "white" }}>{localeStrings.detailItemsStrings.add}</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={this.state.IsCheckinModalVisible}
                        style={styles.modal}
                    >
                        <View style={styles.modalFirstView}>
                            <View style={styles.modalSecondView}>
                                <Image source={require("../../res/images/popuplogo.png")}
                                    resizeMode='cover'
                                    style={styles.modalImage}>
                                </Image>
                                <View style={styles.modalCenterText}>
                                    <Text style={{
                                        fontSize: 18,
                                        color: "gray",
                                        fontWeight: "bold"
                                    }}>{localeStrings.barLocationStrings.ohOh}
                                    </Text>
                                    <Text style={{ fontSize: 15, color: "black", marginTop: 15, textAlign: "center" }}>
                                        {localeStrings.barLocationStrings.checkInToAdd}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'black',
                                        borderStyle: 'solid',
                                        top: "-4%",
                                    }}
                                />
                                <View style={styles.container}>
                                    <TouchableOpacity style={styles.buttonStyle}
                                        onPress={() => this.setState({ IsCheckinModalVisible: false })}>
                                        <Text style={styles.textStyle}>{localeStrings.barLocationStrings.later}</Text>
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            borderLeftWidth: 1,
                                            borderLeftColor: 'black',
                                            borderStyle: 'solid',
                                            height: "215%",
                                            margin: 0,
                                            top: "-4%"
                                        }}
                                    />
                                    <TouchableOpacity style={styles.buttonStyle}
                                        onPress={() => { this.props.navigation.navigate("HomeScreen", { screen: "HomeScreen" }) }}>
                                        <Text style={styles.textStyle}>{localeStrings.barLocationStrings.checkIn}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </View>
            )
        } else {

            return (
                <View style={{
                    flex: 1,
                    flexDirection: "column"
                }}>
                    <ScrollView scrollEnabled={this.state.toScroll} style={{ width: "100%", height: "100%" }} keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled">
                        <View style={styles.ViewImage}>
                            <Image style={styles.imageItem} source={{ uri: this.state.detailsItem.image }} />
                        </View>

                        <View style={{ flexDirection: "row", marginLeft: 15 }}>

                            <View style={{ flexDirection: "column", width: "100%" }}>
                                <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontFamily: "Helvetica",
                                            textAlign: 'center',
                                            width: "50%"
                                        }}>{this.state.detailsItem.name}</Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontFamily: "Helvetica",
                                            textAlign: 'center',
                                            width: "50%"
                                        }}>{I18nManager.isRTL ? <Text>₪ {this.state.itemPrice.toFixed(2)} </Text>
                                            : <Text>{this.state.restCurrencyCode} {this.state.itemPrice.toFixed(2)} {GlobalVariables.restCurrencyCode.value}</Text>}</Text>
                                </View>
                                <Text style={{
                                    fontSize: 14,
                                    fontFamily: "Helvetica",
                                    marginTop: 8,
                                    textAlign: 'left'
                                }}>{this.state.detailsItem.description}</Text>
                            </View>
                            {}
                        </View>

                        <View style={{ backgroundColor: "#D8D8D8", height: 35, marginTop: 12, justifyContent: "center" }}>

                            <Text style={{
                                color: "black",
                                marginLeft: 15,
                                fontFamily: "Helvetica",
                                fontSize: 12,
                                marginTop: 9,
                                textAlign: 'left'
                            }}>{this.params.productType}</Text>


                        </View>

                        <View style={{
                            flexDirection: "row",
                            height: 45,
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginLeft: 15
                        }}>

                            <Text style={styles.TextCriteria}>{localeStrings.detailItemsStrings.quantity}</Text>
                            <View style={{
                                flexDirection: "row",
                                height: 45,
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 15
                            }}>

                                <TouchableOpacity onPress={() => this.quantityMinus()} style={{
                                    height: 45,
                                    width: 45,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <View style={{
                                        height: 35,
                                        width: 45,
                                        borderColor: "black",
                                        borderWidth: 0.5,
                                        borderRadius: 7,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Text>-</Text>
                                    </View>
                                </TouchableOpacity>

                                <Text style={{ marginLeft: 8, marginRight: 8 }}>{this.state.itemQuantity}</Text>

                                <TouchableOpacity onPress={() => this.quantityAdd()} style={{
                                    height: 45,
                                    width: 45,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <View style={{
                                        marginLeft: 8,
                                        marginRight: 8,
                                        height: 35,
                                        width: 45,
                                        borderColor: "black",
                                        borderWidth: 0.5,
                                        borderRadius: 7,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Text>+</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={styles.BorderView} />


                        <TouchableOpacity style={styles.TouchableCriteria} onPress={() => {
                            if (this.state.inputOn === true) {
                                this.setState({
                                    inputOn: false
                                })
                            } else {
                                this.setState({
                                    inputOn: true
                                })
                            }
                        }}>
                            <View style={styles.ViewCriteria}>
                                <Text
                                    style={styles.TextCriteria}>{localeStrings.detailItemsStrings.specialInstructions}</Text>
                                {this.state.inputOn ? <Image style={[styles.ImgViewCriteria, { tintColor: '#000000' }]}
                                    source={require('../../res/images/close.png')} /> : <Image style={styles.ImgViewCriteria}
                                        source={require('../../res/images/plus.png')} />}
                            </View>
                        </TouchableOpacity>
                        {this.state.inputOn ?
                            <KeyboardAvoidingView>
                                <View style={{ height: 80, marginRight: 20, marginLeft: 20, backgroundColor: "#D8D8D8", marginBottom: 8 }}>
                                    <TextInput style={{ height: 80, color: "black", width: "95%", marginLeft: 15, marginRight: 20 }}
                                        multiline={true}
                                        onChangeText={(specialInstructions) => this.setState({ specialInstructions })}
                                        value={this.state.specialInstructions}></TextInput>
                                </View>
                            </KeyboardAvoidingView> : null}

                        <View style={styles.BorderView} />

                    </ScrollView>

                    <View style={{
                        marginBottom: 0,
                        height: 45,
                        width: "100%",
                        backgroundColor: "#004C6C",
                        justifyContent: "flex-end",
                        alignItems: "center",

                    }}>
                        <TouchableOpacity onPress={() => {

                            AsyncStorage.getItem('savedBarId').then((savedBarId) => {
                                if (savedBarId == this.params.barId) {
                                    this.addItemInMenu()
                                } else {
                                    this.setState({ IsCheckinModalVisible: true });
                                }
                            }).done();
                            /*if(this.params.barId == GlobalVariables.checkedInLocation.value && this.state.isCheckIn){
                                this.addItemInMenu()
                            }else{
                                this.setState({IsCheckinModalVisible: true});
                            }*/
                        }} style={{
                            height: 45,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Text style={{ color: "white" }}>{localeStrings.detailItemsStrings.add}</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={this.state.IsCheckinModalVisible}
                        style={styles.modal}
                    >
                        <View style={styles.homeModalView}>
                            <View style={styles.modalSecondView}>
                                <Image source={require("../../res/images/popuplogo.png")}
                                    resizeMode='cover'
                                    style={styles.modalImage}>
                                </Image>
                                <View style={styles.modalCenterText}>
                                    <Text style={{
                                        fontSize: 18,
                                        color: "gray",
                                        fontWeight: "bold"
                                    }}>{localeStrings.barLocationStrings.ohOh}
                                    </Text>
                                    <Text style={{ fontSize: 15, color: "black", marginTop: 15, textAlign: "center" }}>
                                        {localeStrings.barLocationStrings.checkInToAdd}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'black',
                                        borderStyle: 'solid',
                                        top: "-4%",
                                    }}
                                />
                                <View style={styles.container}>
                                    <TouchableOpacity style={styles.CenterText}
                                        onPress={() => this.setState({ IsCheckinModalVisible: false })}>
                                        <Text style={styles.textStyle}>{localeStrings.barLocationStrings.later}</Text>
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            borderLeftWidth: 1,
                                            borderLeftColor: 'black',
                                            borderStyle: 'solid',
                                            height: "215%",
                                            margin: 0,
                                            top: "-4%"
                                        }}
                                    />
                                    <TouchableOpacity style={styles.CenterText}
                                        onPress={() => { this.props.navigation.navigate("HomeScreen", { screen: "HomeScreen" }) }}>
                                        <Text style={styles.textStyle}>{localeStrings.barLocationStrings.checkIn}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            )

        }
    }
}
