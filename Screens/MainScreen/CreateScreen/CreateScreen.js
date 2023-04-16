import { View, Text, TouchableOpacity, Image, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import * as Location from 'expo-location'
import { FontAwesome, Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { styles } from "./style";

import { getDatabase, ref, set } from "firebase/database";

const sendValues = {
    picture: null,
    location: null,
    title: null,
    coords: null,
};

export function CreateScreen({ navigation }) {
    const [post, setPost] = useState(sendValues);
    const [camera, setSnap] = useState(null);
    const [photo, setphoto] = useState(null);
    const [photoload, setPhotoload] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        })();
    }, []);

    const postValues = (post.location && post.title && post.picture);
        
    const takePicture = async () => {
        setPhotoload(true);
        const photos = await camera.takePictureAsync();
        const location = await Location.getCurrentPositionAsync();
        setphoto(photos.uri);
        setPost(prev => ({ ...prev, coords: location.coords, picture: photos.uri }));
        setPhotoload(false);
    };
   
    const send = () => {
        if (!postValues) return Alert.alert('Вы что-то забыли заполнить', 'заполните все поля');
        navigation.navigate("Home", { post });
        setPost(sendValues);
        setphoto(null);
    };
    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <KeyboardAwareScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 16, backgroundColor: '#FFFFFF', }}>
                {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%', paddingHorizontal: 16, backgroundColor: '#FFFFFF', }} > */}
                <View style={{ borderRadius: 8, width: '100%', height: 240, backgroundColor: '#F6F6F6', borderWidth: 1, borderColor: '#E8E8E8', marginTop: 32, overflow: 'hidden', }} >
                    {photo === null ?
                        <Camera ref={setSnap} style={{ flex: 1, }} type={'back'}  >
                            {photoload ?
                                <View style={{ top: '50%', left: '50%', transform: [{ translateY: -20 }, { translateX: -70 }] }}>
                                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, }}>Загрузка, ждите...</Text>
                                </View> :
                                <TouchableOpacity onPress={takePicture} style={{ width: 60, height: 60, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center', top: '50%', left: '50%', transform: [{ translateY: -30 }, { translateX: -30 }] }}>
                                    <FontAwesome name="camera" size={24} color="#BDBDBD" />
                                </TouchableOpacity>}
                        </Camera>
                        :
                        <View style={{ width: '100%', height: '100%' }}>
                            <Image style={{ width: '100%', height: '100%' }} source={{ uri: photo }} />
                            <TouchableOpacity onPress={() => setphoto(null)} style={{ position: 'absolute', width: 60, height: 60, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center', top: '50%', left: '50%', transform: [{ translateY: -30 }, { translateX: -30 }] }}>
                                <FontAwesome name="camera" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <View style={{ marginTop: 8 }}>
                    {camera === null ? <Text style={{ color: '#BDBDBD', fontSize: 16, }}>Редактировать фото</Text> : <Text style={{ color: '#BDBDBD', fontSize: 16, }}>Загрузите фото</Text>}
                </View>
                <TextInput
                    onChangeText={(value) => { setPost(prev => ({ ...prev, title: value })) }} value={post.title}
                    placeholder='Название...' style={{ borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingBottom: 15, width: '100%', marginTop: 48, fontSize: 16 }} />
                <View syle={{ width: '100%' }}>
                    <TextInput
                        onChangeText={(value) => { setPost(prev => ({ ...prev, location: value })) }} value={post.location}
                        placeholder='Местность...' style={{ borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingBottom: 15, width: '100%', marginTop: 32, paddingLeft: 28, fontSize: 16 }} />
                    <Feather name="map-pin" size={18} color="#bdbdbd" style={{ position: 'absolute', left: 4, bottom: 15 }} />
                </View>
                <TouchableOpacity onPress={send} style={{ width: '100%', paddingBottom: 16, paddingTop: 16, backgroundColor: postValues ? '#FF6C00' : '#F6F6F6', borderRadius: 100, marginTop: 32 }}>
                    <Text style={{ fontSize: 16, textAlign: 'center', color: postValues ? '#FFFFFF' : '#BDBDBD' }}>Опубликовать</Text>
                </TouchableOpacity>
                {/* </KeyboardAvoidingView> */}
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
};

