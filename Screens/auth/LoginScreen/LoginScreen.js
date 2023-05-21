import { useEffect, useRef, useState } from "react";
import { TouchableWithoutFeedback, TouchableOpacity, Alert, KeyboardAvoidingView, Keyboard, Text, TextInput, View, ImageBackground, Platform, KeyboardAvoidingViewBase, KeyboardAvoidingViewComponent } from "react-native";
import { styles } from "./style";

import { Loader } from "../../../components/Loader";

import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../../redux/auth/authOprations";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AuthorisationValues = {
    email: '',
    password: '',
};
const borders = {
    email: '#E8E8E8',
    password: '#E8E8E8',
};

export function LoginScreen({ navigation }) {
    const dispatch = useDispatch()
    const [logInValues, setlogInValues] = useState(AuthorisationValues);
    const [showPassword, setShowPassword] = useState(true);
    const [borderColor, setBorderColor] = useState(borders);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const togglePassword = () => setShowPassword(prevState => !prevState);
    const { isLoading } = useSelector(state => state.authorisation);
    const submit = () => {
        if (!logInValues.email || !logInValues.password) {
            return Alert.alert('Ошибка регистрации', 'заполните все поля')
        };
        setlogInValues(AuthorisationValues);
        dispatch(signIn(logInValues));
        Keyboard.dismiss();
        
    };
  
    return (
          isLoading ? <Loader /> :
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => { Keyboard.dismiss(); setShowKeyboard(false); }}>
            <ImageBackground source={require('../../../assets/sky.png')} resizeMode="cover" style={styles.backgrounImageCon5tainer}>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setShowKeyboard(false); }}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                        <View style={styles.formBox}>
                            <Text style={[styles.mainText, { marginTop: 32 }]} >Войти</Text>
                            <View style={{ marginTop: 33, width: '100%' }}>
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
                                        setlogInValues(prevState => ({ ...prevState, email: value }))
                                    }}
                                    value={logInValues.email}
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
                                        setlogInValues(prevState => ({ ...prevState, password: value }))
                                    }}
                                    value={logInValues.password}
                                />
                                <View style={styles.changeVisible}>
                                    <Text style={{ color: '#1B4371', fontSize: 16 }} onPress={togglePassword} >{showPassword ? 'Показать' : 'Скрыть'}</Text>
                                </View>
                            </View>
                            {!showKeyboard && <>
                                <TouchableOpacity onPress={submit} style={styles.btn}>
                                    <Text style={{ fontSize: 16, color: '#FFFFFF' }}>Войти</Text>
                                </TouchableOpacity>
                                <View style={{ marginTop: 16, marginBottom: 144 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{}}>
                                        <Text style={{ color: '#1B4371', fontSize: 16 }}>Нет аккаунта? Зарегистрироваться</Text>
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
