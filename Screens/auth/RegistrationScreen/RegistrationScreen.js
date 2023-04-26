import { useEffect, useState } from "react";
import { TouchableWithoutFeedback, TouchableOpacity, Alert, KeyboardAvoidingView, Keyboard, Text, TextInput, View, ImageBackground, Image, Platform } from "react-native";
import { AntDesign,Ionicons } from '@expo/vector-icons';
import { styles } from "./style";
import { useDispatch,useSelector } from "react-redux";
import { signUp } from "../../../redux/auth/authOprations";
import { Camera } from "expo-camera";
import { nanoid } from "nanoid/non-secure";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../../../firebase/config";
import { inRegister, inRegisterWithoutPhoto, photoFromFireBase, takeDevicePhoto } from "../../../redux/auth/authReducer";
import { updateProfile } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';


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

export function RegistrationScreen({ navigation }) {

    const [signUpValues, setSignUpValues] = useState(AuthorisationValues);
    const [showPassword, setShowPassword] = useState(true);
    const [borderColor, setBorderColor] = useState(borders);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [camera, setSnap] = useState(null);
    const [photo, setphoto] = useState(null);
    const togglePassword = () => setShowPassword(prevState => !prevState);
    const dispatch = useDispatch();
    const { devicePhoto } = useSelector(state => state.authorisation);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
        })();
    }, []);

    const takePicture = async () => {
        const photos = await camera.takePictureAsync();
        setphoto(photos.uri);
        dispatch(takeDevicePhoto(photos.uri))
    };

    const uploadPhotoToServer = async (photo) => {
        const response = await fetch(photo);
        const file = await response.blob();
        const id = nanoid();
        const posts = ref(storage, `posts/${id}`);
        const uoloadImage = await uploadBytes(posts, file);
        const downloadImage = await getDownloadURL(posts);
        return downloadImage;
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            setphoto(result.assets[0].uri);
            dispatch(takeDevicePhoto(result.assets[0].uri))
        };
    };

    const submit = async () => {
        if (!signUpValues.email || !signUpValues.name || !signUpValues.password) {
            return Alert.alert('Ошибка регистрации', 'заполните все поля');
        };
        await dispatch(signUp(signUpValues)).then(async (user) => {
            console.log('value', user);
            try {
                if (photo) {
                const img = await uploadPhotoToServer(devicePhoto)
                console.log('img', img);
                await updateProfile(auth.currentUser, { photoURL: img, displayName: signUpValues.name });
                const updatedValues = {
                    photo: auth.currentUser.photoURL,
                    nameP: auth.currentUser.displayName
                };
                dispatch(photoFromFireBase(updatedValues));
            } else {
                await updateProfile(auth.currentUser, { displayName: signUpValues.name });
                dispatch(inRegisterWithoutPhoto(auth.currentUser.displayName));
                };
                dispatch(inRegister());
            } catch (error) {
                return Alert.alert('Ошибка');
            }
            
            
        });
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={() => { setShowKeyboard(false); Keyboard.dismiss() }}>
            <ImageBackground source={require('../../../assets/sky.png')} resizeMode="cover" style={styles.backgrounImageCon5tainer}>
                <TouchableWithoutFeedback onPress={() => { setShowKeyboard(false); Keyboard.dismiss() }}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                        <View style={styles.formBox}>
                            <View style={styles.profileImageContainer}>
                                {photo ? <Image source={{ uri: photo }} style={{ flex: 1, borderRadius: 75, overflow: 'hidden', }} /> :
                                    <Camera ref={setSnap} style={{ flex: 1, borderRadius: 75, overflow: 'hidden', }} type={'front'}  ></Camera>}
                                <TouchableOpacity style={styles.profileButton}>
                                    <Ionicons onPress={!photo ? takePicture : () => setphoto(null)} name="camera-outline" size={28} color='red' />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileButton2}>
                                    <AntDesign onPress={pickImage} name="pluscircleo" size={28} color='#FF6C00' />
                                </TouchableOpacity>
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
                                    onFocus={() => { setShowKeyboard(true); setBorderColor(prev => ({ ...prev, email: '#FF6C00' })) }}
                                    onBlur={() => { setBorderColor(prev => ({ ...prev, email: '#E8E8E8' })) }}
                                    placeholderTextColor={'#BDBDBD'}
                                    keyboardType="email-address"
                                    placeholder="Адрес электронной почты"
                                    style={[styles.input, { borderColor: borderColor.email }]}
                                    onChangeText={(value) => { setSignUpValues(prevState => ({ ...prevState, email: value })) }}
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


