import { useEffect, useState } from "react";
import { Dimensions, FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { View, Text, Image } from "react-native";
import { EvilIcons, Feather,AntDesign } from '@expo/vector-icons';
import { styles } from "./style";
import { useSelector } from "react-redux";
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Touchable } from "react-native";
import Lottie from 'lottie-react-native';
import { useRef } from "react";
// import { useRef } from "react";
// import { Animated, Easing } from 'react-native';

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
    const [liked, setHasLiked] = useState(false);
    const [whoLiked, setWhoLiked] = useState([]);
    const [showLikeList, setShowLikeList] = useState(false);
    const { userId, nickName, profileImage } = useSelector(state => state.authorisation);
    // console.log('whoLiked', whoLiked);
    const anim = useRef(null);
    const likeAnim = useRef(null);
    const firstPlayAnim = useRef(true)

    useEffect(() => {
        if (firstPlayAnim.current) {
            if (liked) {
                likeAnim.current.play(80, 80)
            } else { likeAnim.current.play(1, 1) };
            firstPlayAnim.current = false;
        } else if (liked) {
            likeAnim.current.play(1, 80)
        } else { likeAnim.current.play(80, 1) };
    }, [liked]);

    useEffect(() => {
        setTimeout(() => {
            anim.current.play();
        }, 0)
    }, [])



    useEffect(() => {
        const unsubscribeComments = onSnapshot(collection(db, `Posts/${item.id}/comments`), (store) => {
            setcount(store.size);
        });
        const unsubscribeLikes = onSnapshot(collection(db, `Posts/${item.id}/likes`), (store) => {
            setWhoLiked(store.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            // console.log('aaaaa',store.forEach((doc)=>console.log(doc.data())));
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
        // console.log('like Added');
    };
    const deleteLike = async () => {
        const idLike = Date.now().toString();
        const alovelaceDocumentRef = doc(db, `Posts/${item.id}`);
        await deleteDoc(doc(alovelaceDocumentRef, "likes", `${userId}`));
        // console.log('like Deleted');
    };

    return (
        <View
            style={{ width: '100%', marginBottom: 34, }} >
            <Modal visible={showLikeList} animationType="slide" >
                <FlatList onPress={() => {  setShowLikeList(false) }}
                    style={{ paddingTop: 50, paddingHorizontal: 16, }}
                    data={whoLiked}
                    keyExtractor={(item, idx) => idx.toString()}
                    renderItem={({ item }) => <LikeUser item={item} />}
                />
                <TouchableOpacity onPress={() => { setShowLikeList(false) }} style={{ position: 'absolute', bottom: 60, right: 40, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 10 }}>Закрыть</Text><AntDesign name="closecircleo" size={24} color="black" />
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity style={{position: 'relative'}} onPress={() => { navigation.navigate("Коментарии", { item }) }}>
                 
                <Image source={{ uri: item.picture }} style={{ width: Dimensions.get('window').width-32, height: Dimensions.get('window').width*60/100, borderRadius: 8 }} />
                <Text style={{ marginTop: 8, color: '#212121', fontWeight: 500 }}>{item.title}</Text>
                <Image source={{ uri: item.profileImage }} style={{ width: 40, height: 40, borderRadius: 10,position: 'absolute',top:5,right:5, }} />
            </TouchableOpacity>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 11, width: '100%' }}  >
                <TouchableOpacity onPress={() => navigation.navigate("Коментарии", { item })} style={{ display: 'flex', flexDirection: 'row',alignItems:'center' }}>
                    <EvilIcons name="comment" size={18} color={count > 0 ? '#FF6C00' : "#BDBDBD"} /><Text style={{ color: '#bdbdbd', marginLeft: 8 }}>{count}</Text>
                </TouchableOpacity >

                <TouchableOpacity onPress={() => { liked ? deleteLike() : addLike() }} >
                 <Lottie ref={likeAnim} source={require('../../../assets/like-button.json')} autoPlay={false} loop={false} speed={1}  style={{ width:30,height:30,marginRight: 8 }} />
                    {/* <AntDesign name={liked ? "like1" : "like2"} size={18} color={liked ? '#FF6C00' : "#BDBDBD"} /> */}
                </TouchableOpacity >

                <TouchableOpacity onPress={() => { likesCount > 0 ? setShowLikeList(true) : setShowLikeList(false) }} style={{ display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                    <Text style={{ color: '#bdbdbd', marginLeft: 8 }}>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</Text>
                </TouchableOpacity >

                <TouchableOpacity onPress={() => navigation.navigate("Карта", { item })} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Lottie ref={anim} source={require('../../../assets/53469-maps-point.json')}   autoPlay loop style={{ width:25,height:25,marginRight: 8 }} />
                    {/* <Feather name="map-pin" size={18} color="red" style={{ marginRight: 8 }} /> */}
                    <Text style={{ textDecorationLine: "underline", textDecorationStyle: "solid", textDecorationColor: "#000", color: '#212121' }}>{item.location}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

function LikeUser({item}) {
    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 8, marginBottom: 8, alignItems: 'center' }}>
            <Image source={{ uri: item.profileImage }} style={{ width: 40, height: 40, borderRadius: 10, marginRight: 8 }} />
            <View>
                <Text style={{ fontSize: 16, fontWeight: 400, color: '#212121' }} >{item.name}</Text>
            </View>
        </View>
    );
};