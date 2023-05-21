import { View, Text, TouchableOpacity, Image, TextInput, Alert, Keyboard, TouchableWithoutFeedback, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import * as Location from 'expo-location'
import { FontAwesome, Feather,MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { setDoc, doc } from "firebase/firestore"; 
import { styles } from "./style";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db,storage} from "../../../firebase/config";
import 'react-native-get-random-values';
import { nanoid } from 'nanoid/non-secure'
import { Camera } from "expo-camera";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';

const sendValues = {
    location: null,
    title: null,
    coords: null,
    nickName: null,
    userId:null,
};
export function CreateScreen({ navigation }) {
    const [post, setPost] = useState(sendValues);
    const [camera, setSnap] = useState(null);
    const [photo, setphoto] = useState(null);
    const [photoload, setPhotoload] = useState(false);
    const { nickName, userId } = useSelector(state => state.authorisation);
    const [flipCamera, setFlipCamera] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
        })();
    }, []);

    useEffect(() => {
        setPost(prev => ({ ...prev, nickName: nickName, userId: userId }));
    }, []);
    
    const toggleCamera = () => setFlipCamera(prev => !prev);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        if (!result.cancelled) {
            setphoto(result.assets[0].uri);
        };
    };

    const uploadPhotoToServer = async () => {
        const response = await fetch(photo);
        const file = await response.blob();
        const id = nanoid();
        const posts = ref(storage, `posts/${id}`);
        const uoloadImage = await uploadBytes(posts, file);
        const downloadImage = await getDownloadURL(posts);
        return downloadImage;
    };

    const uploadPostToFireStore = async (image) => {
        const id = Date.now().toString();
        await setDoc(doc(db, "Posts", `${id}`), { ...post, picture: image });
    };

    const postValues = (post.location && post.title && photo);
        
    const takePicture = async () => {
        setPhotoload(true);
        const photos = await camera.takePictureAsync();
        const location = await Location.getCurrentPositionAsync();
        setphoto(photos.uri);
        setPost(prev => ({ ...prev, coords: location.coords }));
        setPhotoload(false);
    };
   
    const send = async () => {
        try {
            if (!postValues) return Alert.alert('Вы что-то забыли заполнить', 'заполните все поля');
            const image = await uploadPhotoToServer();
            uploadPostToFireStore(image);
            navigation.navigate("Home");
            setPost(sendValues);
            setphoto(null);
        } catch (error) {
            return Alert.alert('что-то пошло не так...')
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <KeyboardAwareScrollView style={{ flex:1, width: '100%',height: '100%', paddingHorizontal: 16, backgroundColor: '#fff', }}>
                <View style={{ borderRadius: 8, width: Dimensions.get('window').width-32, height: Dimensions.get('window').width*60/100,alignSelf: 'center',  backgroundColor: '#F6F6F6', borderWidth: 1,overflow:'hidden', borderColor: '#E8E8E8', marginTop: 32, }} >
                    {photo === null ?
                        <Camera ref={setSnap} style={{ flex: 1, }} type={flipCamera ? 'front' : 'back'}  >
                            {photoload ?
                                <View style={{ top: '50%', left: '50%', transform: [{ translateY: -20 }, { translateX: -70 }] }}>
                                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, }}>Загрузка, ждите...</Text>
                                </View> :
                                <View style={{ width: '100%', height: '100%' }}>
                                    <TouchableOpacity onPress={takePicture} style={{ width: 60, height: 60, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center', top: '50%', left: '50%', transform: [{ translateY: -30 }, { translateX: -30 }] }}>
                                        <FontAwesome name="camera" size={24} color="#BDBDBD" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleCamera} style={{ width: 40, height: 40, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center', top: '50%', left: '50%', transform: [{ translateY: -80 }, { translateX: 130 }] }}>
                                        <MaterialIcons name="flip-camera-android" size={20} color="#BDBDBD" />
                                    </TouchableOpacity>
                                </View>}
                        </Camera> :
                        <View style={{ width: '100%', height: '100%' }}>
                            <Image style={{ width: '100%', height: '100%' }} source={{ uri: photo }} />
                            <TouchableOpacity onPress={() => setphoto(null)} style={{ position: 'absolute', width: 60, height: 60, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center', top: '50%', left: '50%', transform: [{ translateY: -30 }, { translateX: -30 }] }}>
                                <FontAwesome name="camera" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>}
                </View>
                <TouchableOpacity onPress={pickImage} style={{ padding: 8 }}>
                    <Text style={{ color: '#BDBDBD', fontSize: 16, }}>Загрузите фото</Text>
                </TouchableOpacity>
                <TextInput
                    onChangeText={(value) => { setPost(prev => ({ ...prev, title: value })) }} value={post.title}
                    placeholder='Название...' style={{ borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingBottom: 15, width: '100%', marginTop: 48, fontSize: 16 }} />
                <View syle={{ width: '100%' ,alignItems: 'center'}}>
                    <TextInput
                        onChangeText={(value) => { setPost(prev => ({ ...prev, location: value })) }} value={post.location}
                        placeholder='Местность...' style={{ borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingBottom: 15, width: '100%', marginTop: 32, paddingLeft: 28, fontSize: 16 }} />
                    <Feather name="map-pin" size={18} color="#bdbdbd" style={{ position: 'absolute', left: 4, bottom: 15 }} />
                </View>
                <TouchableOpacity onPress={send} style={{ width: '100%', paddingBottom: 16, paddingTop: 16, backgroundColor: postValues ? '#FF6C00' : '#F6F6F6', borderRadius: 100, marginTop: 32 }}>
                    <Text style={{ fontSize: 16, textAlign: 'center', color: postValues ? '#FFFFFF' : '#BDBDBD' }}>Опубликовать</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
};

