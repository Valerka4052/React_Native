import { useState } from "react";
import { TouchableWithoutFeedback, TouchableOpacity, Alert, KeyboardAvoidingView, Keyboard, Text, TextInput, View, ImageBackground, Image, Platform } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { styles } from "./style";
import { authSignInUser } from "../../../redux/auth/authOprations";
import { useDispatch } from "react-redux";
import { signUp } from "../../../redux/auth/authOprations";



const AuthorisationValues = {
    email: '',
    name: '',
    password: '',
};
const borders = {
    email: '#E8E8E8',
    password: '#E8E8E8',
    name: '#E8E8E8',
};

export function RegistrationScreen({navigation}) {
    const [signUpValues, setSignUpValues] = useState(AuthorisationValues);
    const [showPassword, setShowPassword] = useState(true);
    const [borderColor, setBorderColor] = useState(borders);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const togglePassword = () => setShowPassword(prevState => !prevState);
    const dispatch = useDispatch();

    const submit = () => {
        if (!signUpValues.email || !signUpValues.name || !signUpValues.password) {
            return Alert.alert('Ошибка регистрации', 'заполните все поля')
        };
        // console.log(signUpValues);
        setSignUpValues(AuthorisationValues);
        dispatch(signUp(signUpValues));
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={() => { setShowKeyboard(false); Keyboard.dismiss() }}>
            <ImageBackground source={require('../../../assets/sky.png')} resizeMode="cover" style={styles.backgrounImageCon5tainer}>
                <TouchableWithoutFeedback onPress={() => { setShowKeyboard(false); Keyboard.dismiss() }}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                        <View style={styles.formBox}>
                            <View style={styles.profileImageContainer}>
                                <Image source={require('../../../assets/user.png')} style={styles.profileImage} />
                                <View>
                                    <AntDesign name="closecircleo" size={25} color='#E8E8E8' style={styles.profileButton} />
                                    {/* <AntDesign name="pluscircleo" size={25} color='#FF6C00' style={styles.profileButton} /> */}
                                </View>
                            </View>
                            <Text style={[styles.mainText, { marginTop: 92 }]} >Регистрация</Text>
                            <View style={{ marginTop: 33, width: '100%' }}>
                                <TextInput
                                    onFocus={() => {
                                        setShowKeyboard(true)
                                        setBorderColor(prev => ({ ...prev, name: '#FF6C00' }))
                                    }}
                                    onBlur={() => {
                                        setBorderColor(prev => ({ ...prev, name: '#E8E8E8' }))
                                    }}
                                    placeholderTextColor={'#BDBDBD'}
                                    placeholder="Логин"
                                    style={[styles.input, { borderColor: borderColor.name }]}
                                    onChangeText={(value) => {
                                        setSignUpValues(prevState => ({ ...prevState, name: value }))
                                    }}
                                    value={signUpValues.name}
                                />
                            </View>
                            <View style={{ marginTop: 16, width: '100%' }}>
                                <TextInput
                                    onFocus={() => {
                                        setShowKeyboard(true)
                                        setBorderColor(prev => ({ ...prev, email: '#FF6C00' }))
                                    }}
                                    onBlur={() => {
                                        setBorderColor(prev => ({ ...prev, email: '#E8E8E8' }))
                                    }}
                                    placeholderTextColor={'#BDBDBD'}
                                    keyboardType="email-address"
                                    placeholder="Адрес электронной почты"
                                    style={[styles.input, { borderColor: borderColor.email }]}
                                    onChangeText={(value) => {
                                        setSignUpValues(prevState => ({ ...prevState, email: value }))
                                    }}
                                    value={signUpValues.email}
                                />
                            </View>
                            <View style={{ width: '100%', marginTop: 16, marginBottom: showKeyboard ? 32 : 43 }}>
                                <TextInput
                                    onFocus={() => {
                                        setShowKeyboard(true)
                                        setBorderColor(prev => ({ ...prev, password: '#FF6C00' }))
                                    }}
                                    onBlur={() => {
                                        setBorderColor(prev => ({ ...prev, password: '#E8E8E8' }))
                                    }}
                                    placeholderTextColor={'#BDBDBD'}
                                    secureTextEntry={showPassword}
                                    placeholder="Пароль"
                                    style={[styles.input, { borderColor: borderColor.password },]}
                                    onChangeText={(value) => {
                                        setSignUpValues(prevState => ({ ...prevState, password: value }))
                                    }}
                                    value={signUpValues.password}
                                />
                                <TouchableOpacity style={styles.changeVisible}>
                                    <Text style={{ color: '#1B4371', fontSize: 16 }} onPress={togglePassword} >{showPassword ? 'Показать' : 'Скрыть'}</Text></TouchableOpacity>
                            </View>
                            {!showKeyboard && <>
                                <TouchableOpacity onPress={submit} style={styles.btn}>
                                    <Text style={{ fontSize: 16, color: '#FFFFFF' }}>Зарегистрироваться</Text>
                                </TouchableOpacity>
                                <View style={{ marginTop: 16, marginBottom: 78 }}>
                                    <TouchableOpacity onPress={() => navigation.goBack()} style={{}}>
                                        <Text style={{ color: '#1B4371', fontSize: 16 }}>Уже есть аккаунт? Войти</Text>
                                    </TouchableOpacity>
                                </View>
                            </>}
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
};
