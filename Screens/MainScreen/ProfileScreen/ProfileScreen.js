import { View, Text, Dimensions } from "react-native"
import { styles } from "./style";
import { ImageBackground, Image, FlatList } from "react-native";
import { EvilIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Alert } from "react-native";
import Lottie from 'lottie-react-native';



export function ProfileScreen({ navigation }) {
    const { userId, profileImage } = useSelector(state => state.authorisation);
    const [arr, setArr] = useState([]);
    
    useEffect(() => {
        const q = query(collection(db, "Posts"), where("userId", "==", userId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setArr(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        });
        return () => unsubscribe();
    }, []);

    return (
        <ImageBackground source={require('../../../assets/sky.png')} resizeMode="cover" style={{ flex: 1, paddingTop: 100, justifyContent: 'flex-end' }}>
            <View style={{ alignItems: 'center', backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, width: '100%', paddingLeft: 16, paddingRight: 16 }}>
                <View style={{ position: 'absolute', top: -60 }}>
                    <Image
                        // source={{ uri: profileImage }}
                        source={profileImage ? { uri: profileImage } : require('../../../assets/user.png')}
                        style={{ width: 120, height: 120, borderRadius: 16, }} />
                                   </View>
                <View style={{ paddingTop: 70 }}>
                    <FlatList
                        ListEmptyComponent={Empty}
                        data={arr}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <Post arr={arr} item={item} navigation={navigation} />}
                    />
                </View>
            </View>
        </ImageBackground>
    );
};

function Post({ item, navigation,arr }) {
    const [count, setCount] = useState(0)
           const anim = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            anim.current.play();
        }, 0)
    }, [arr])
    
    useEffect(() => {
        const unsubscribeComments = onSnapshot(collection(db, `Posts/${item.id}/comments`), (store) => {
            setCount(store.size);
        });
        return () => unsubscribeComments();
    }, []);

    const deletePostFromStorage = async () => {
        await deleteDoc(doc(db, "Posts", `${item.id}`));
        // console.log('Post deleted');
    };

    const deletePost = () => {
        Alert.alert('Ваш пост будет удален', 'Удалить пост?', [
            { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel', },
            { text: 'OK', onPress: () => deletePostFromStorage() },
        ]);
    };

    return (
        <View
            style={{ width: '100%', marginBottom: 34, }}>
            <TouchableOpacity onPress={() => navigation.navigate("Коментарии", { item })}>
                <Image source={{ uri: item.picture }} style={{ width: Dimensions.get('window').width-32, height: Dimensions.get('window').width*60/100, borderRadius: 8 }} />
                <Text style={{ marginTop: 8, color: '#212121', fontWeight: 500 }}>{item.title}</Text>
            </TouchableOpacity>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 11, width: '100%' }}  >
                <TouchableOpacity onPress={() => navigation.navigate("Коментарии", { item })} style={{ display: 'flex', flexDirection: 'row', }}>
                    <EvilIcons name="comment" size={18} color={count > 0 ? '#FF6C00' : "#BDBDBD"} /><Text style={{ color: '#bdbdbd', marginLeft: 8 }}>{count}</Text>
                </TouchableOpacity >
                <TouchableOpacity onPress={() => navigation.navigate("Карта", { item })} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Feather name="map-pin" size={18} color="red" style={{ marginRight: 8 }} />
                    <Text style={{ textDecorationLine: "underline", textDecorationStyle: "solid", textDecorationColor: "#000", color: '#212121' }}>{item.location}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deletePost} style={{ zIndex: 2, position: 'absolute', bottom: 70, right: 30, width: 40, height: 40, borderRadius: 50, backgroundColor: '#FF6C00', alignItems: 'center', justifyContent: 'center', }} >
                    <Lottie ref={anim} source={require('../../../assets/65780-delete.json')} speed={0.4}   autoPlay loop style={{ width:25,height:25 }} />
                    {/* <MaterialIcons name="delete" size={24} color="#fff" /> */}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const Empty = () => {
    return (
        <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 14, fontWeight: 300, fontStyle: 'italic' }}>У Вас пока нет постов</Text>
        </View>
    );
};