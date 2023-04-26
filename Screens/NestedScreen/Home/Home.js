import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View, Text, Image } from "react-native";
import { EvilIcons, Feather,AntDesign } from '@expo/vector-icons';
import { styles } from "./style";
import { useSelector } from "react-redux";
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

export function Home({ navigation }) {
    const [arr, setArr] = useState([]);


    useEffect(() => {
        const unsubscribePosts = onSnapshot(collection(db, "Posts"), (store) => {
            setArr(store.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        });
        return () => unsubscribePosts();
    }, []);
    
    return (
        <View style={{ flex: 1, width: '100%', paddingHorizontal: 16, }}>
            <FlatList
                ListHeaderComponent={Head}
                data={arr}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <Post item={item} navigation={navigation} />}
            />
        </View>
    );
};

function Head() {
    const { email, nickName, profileImage } = useSelector(state => state.authorisation);

    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 32, marginBottom: 32, alignItems: 'center' }}>
            <Image source={profileImage?{uri:profileImage}:require('../../../assets/user.png')} style={{ width: 60, height: 60, borderRadius: 16, marginRight: 8 }} />
            <View>
                <Text style={{ fontSize: 16, fontWeight: 700, color: '#212121' }} >{nickName}</Text>
                <Text style={{ fontSize: 16, fontWeight: 400, color: 'rgba(33, 33, 33, 0.8)' }}>{email}</Text>
            </View>
        </View>
    );
};

function Post({ item, navigation }) {
    const [count, setcount] = useState(0);
    const [likesCount, setLikesCount] = useState(0);
    const [hasLike, setHasLike] = useState(false);
    const [liked, setHasLiked] = useState(false);
    const [whoLiked, setWhoLiked] = useState([])
    const { userId, nickName, profileImage } = useSelector(state => state.authorisation);
    console.log('whoLiked',whoLiked);
    useEffect(() => {
        const unsubscribeComments = onSnapshot(collection(db, `Posts/${item.id}/comments`), (store) => {
            setcount(store.size);
        });
        const unsubscribeLikes = onSnapshot(collection(db, `Posts/${item.id}/likes`), (store) => {
            setWhoLiked(store.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            console.log('aaaaa',store.forEach((doc)=>console.log(doc.data())));
            setLikesCount(store.size);
        });
        const unsubscribeMyLikes = onSnapshot(doc(db, `Posts/${item.id}/likes`, `${userId}`), (doc) => {
            
            setHasLiked(doc.exists());
           
        });
        return () => {
            unsubscribeComments();
            unsubscribeLikes();
            unsubscribeMyLikes();
        };
    }, []);

    const addLike = async () => {
        const idLike = Date.now().toString();
        const alovelaceDocumentRef = doc(db, `Posts/${item.id}`);
        await setDoc(doc(alovelaceDocumentRef, "likes", `${userId}`), {
            name: `${nickName}`,
            profileImage: `${profileImage}`,
        });
        setHasLike(true)
        console.log('like Added');
    };
    const deleteLike = async () => {
        const idLike = Date.now().toString();
        const alovelaceDocumentRef = doc(db, `Posts/${item.id}`);
        await deleteDoc(doc(alovelaceDocumentRef, "likes", `${userId}`));
        setHasLike(false)
        console.log('like Deleted');
    };

    return (
        <View
            style={{ width: '100%', marginBottom: 34, }}>
            <TouchableOpacity onPress={() => navigation.navigate("Коментарии", { item })}>
                <Image source={{ uri: item.picture }} style={{ width: '100%', height: 260, borderRadius: 8 }} />
                <Text style={{ marginTop: 8, color: '#212121', fontWeight: 500 }}>{item.title}</Text>
            </TouchableOpacity>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 11, width: '100%' }}  >
                <TouchableOpacity onPress={() => navigation.navigate("Коментарии", { item })} style={{ display: 'flex', flexDirection: 'row', }}>
                    <EvilIcons name="comment" size={18} color={count>0?'#FF6C00':"#BDBDBD"} /><Text style={{ color: '#bdbdbd', marginLeft: 8 }}>{count }</Text>
                </TouchableOpacity >

                <TouchableOpacity onPress={() => {hasLike?deleteLike():addLike()}}  style={{ display: 'flex', flexDirection: 'row', }}>
                    <AntDesign name={liked?"like1":"like2"} size={18} color={liked?'#FF6C00':"#BDBDBD"} /><Text style={{ color: '#bdbdbd', marginLeft: 8 }}>{likesCount }</Text>
                </TouchableOpacity >

                <TouchableOpacity onPress={() => navigation.navigate("Карта", { item })} style={{ display: 'flex', flexDirection: 'row',justifyContent: 'center' }}>
                    <Feather name="map-pin" size={18} color="red" style={{ marginRight: 8 }} />
                    <Text style={{ textDecorationLine: "underline", textDecorationStyle: "solid", textDecorationColor: "#000", color: '#212121' }}>{item.location}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};