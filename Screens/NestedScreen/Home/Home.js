import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View, Text, Image } from "react-native"
import { EvilIcons, Feather } from '@expo/vector-icons';
import { styles } from "./style";


export function Home({ route, navigation }) {
    const [arr, setArr] = useState([]);
    useEffect(() => {
        if(route.params)return setArr(prev => [...prev, route.params.post])
    }, [route.params]);

    return (
        <View style={{ flex: 1, width: '100%', paddingHorizontal: 16, }}>
            <FlatList
                ListHeaderComponent={Head}
                data={arr}
                keyExtractor={(item, indx) => indx.toString()}
                renderItem={({ item }) => <Post item={item} navigation={navigation} />}
            />
        </View>
    );
};

function Head() {
    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 32, marginBottom: 32, alignItems: 'center' }}>
            <Image source={require('../../../assets/user.png')} style={{ width: 60, height: 60, borderRadius: 16, marginRight: 8 }} />
            <View>
                <Text style={{ fontSize: 16, fontWeight: 700, color: '#212121' }} >Name Surname</Text>
                <Text style={{ fontSize: 16, fontWeight: 400, color: 'rgba(33, 33, 33, 0.8)' }}>Email@example.com</Text>
            </View>
        </View>
    );
};

function Post({item,navigation}) {
    return (
        <View
            style={{ width: '100%', marginBottom: 34, }}>
            <Image source={{ uri: item.picture }} style={{ width: 343, height: 240, borderRadius: 8 }} />
            <Text style={{ marginTop: 8, color: '#212121', fontWeight: 500 }}>{item.title}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 11, width: '100%' }}  >
                <TouchableOpacity onPress={() => navigation.navigate("Коментарии", { item })} style={{ display: 'flex', flexDirection: 'row', }}>
                    <EvilIcons name="comment" size={18} color="#BDBDBD" /><Text style={{ color: '#bdbdbd', marginLeft: 8 }}>0</Text>
                </TouchableOpacity >
                <TouchableOpacity onPress={() => navigation.navigate("Карта", { item })} style={{ display: 'flex', flexDirection: 'row', }}>
                    <Feather name="map-pin" size={18} color="#BDBDBD" style={{ marginRight: 8 }} />
                    <Text style={{ textDecorationLine: "underline", textDecorationStyle: "solid", textDecorationColor: "#000", color: '#212121' }}>{item.location}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};