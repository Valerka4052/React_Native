import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, FlatList, LogBox } from "react-native";
import { styles } from "./style";
import { AntDesign } from '@expo/vector-icons';
import { db } from "../../../firebase/config";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'

export function CommentsScreen({ route }) {
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState([]);
    const {nickName,profileImage,userId} = useSelector(state=>state.authorisation)
    const { picture, id } = route.params.item;
    const today = new Date();
    const str = today.toLocaleString();

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, `Posts/${id}`, 'comments'), (store) => {
            setCommentList(store.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        });
        return () => unsubscribe();
    }, [id]);
    
    const createComment = async () => {
        const idComment = Date.now().toString();
        const alovelaceDocumentRef = doc(db, `Posts/${id}`);
        await setDoc(doc(alovelaceDocumentRef, "comments", `${idComment}`), {
            comment: comment,
            nickName: nickName,
            date: str,
            profileImage: profileImage,
        });
        console.log('Comment Added=>', comment);
    };
      
    const submitComment = () => {
        if (!comment) return;
        createComment();
        setComment('');
        Keyboard.dismiss();
    };

    return (
        <View style={{ flex: 1, width: '100%', paddingHorizontal: 16, }}>
            <KeyboardAwareView animated={true}>
                <TouchableWithoutFeedback style={{}} onPress={() => { Keyboard.dismiss(); }}>
                    <FlatList ListHeaderComponent={<Head picture={picture} />} ListEmptyComponent={Empty} data={commentList} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <Comment item={item} userId={userId} nickName={nickName} profileImage={profileImage} />} />
                </TouchableWithoutFeedback>
                <TextInput placeholder="Комментировать..." value={comment} onChangeText={text => setComment(text)} placeholderTextColor={'#BDBDBD'} multiline={true} style={{ width: '100%', height: 50, borderRadius: 100, borderColor: '#E8E8E8', borderWidth: 1, backgroundColor: '#F6F6F6', fontSize: 16, color: '#212121', paddingTop: 16, paddingBottom: 15, paddingLeft: 16, paddingRight: 42 }} />
                <TouchableOpacity onPress={submitComment} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#FF6C00', alignItems: 'center', padding: 10, position: 'absolute', right: 8, bottom: 8 }}>
                    <AntDesign name="arrowup" size={14} color="#fff" />
                </TouchableOpacity>
            </KeyboardAwareView>
        </View>
    );
};

const Comment = ({ item, nickName, profileImage }) => {
    const myComment = (nickName === item.nickName);
    return (
        <View style={{ width: '80%', marginTop: 10, alignSelf: myComment ? 'flex-end' : 'flex-start', flexDirection: !myComment ? 'row' : 'row-reverse', marginLeft: myComment ? 'auto' : 0, marginRight: !myComment ? 'auto' : 0 }}>
            <Image source={{ uri: myComment ? profileImage : item.profileImage }} style={{ width: 40, height: 40, borderRadius: 10, }}></Image>
            <View style={{ width: '70%', padding: 10, backgroundColor: 'silver', borderRadius: 8, }}>
                <Text style={{ fontWeight: 500, fontSize: 16, color: '#212121' }}>{item.nickName}</Text>
                <Text style={{ fontWeight: 400, fontSize: 14 }} >{item.comment}</Text>
                <Text style={{ fontWeight: 300, fontSize: 10 }} >{item.date}</Text>
            </View>
        </View>
    );
};

const Head = ({ picture }) => {
    return (
        <View style={{ flex: 1, display: 'flex', alignItems: 'center',}}>
            <Image style={{ width: 343, height: 240, borderRadius: 8, marginTop: 32, }} source={{ uri: picture }} />
        </View>
    );
};

const Empty = () => {
    return (
        <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 14, fontWeight: 300, fontStyle: 'italic' }}>Вы можете быть первым, кто оставил коментарий:)</Text>
        </View>
    );
};