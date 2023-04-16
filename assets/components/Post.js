import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View, Text, Image } from "react-native"
import { EvilIcons,Feather } from '@expo/vector-icons';


export function Post({ route }) {
    return (
        <View
            style={{ width: '100%', marginBottom: 34, }}>
            <Image source={{ uri: item.picture }} style={{ width: '100%', height: 240, borderRadius: 8 }} />
            <Text style={{ marginTop: 8, color: '#212121', fontWeight: 500 }}>{item.title}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 11, width: '100%' }}  >
                <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', }}>
                    <EvilIcons name="comment" size={18} color="#BDBDBD" /><Text style={{ color: '#bdbdbd', marginLeft: 8 }}>0</Text>
                </TouchableOpacity >
                <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', }}>
                    <Feather name="map-pin" size={18} color="#bdbdbd" style={{ marginRight: 8 }} />
                    <Text style={{ textDecoration: 'underline', color: '#212121' }}>{item.location}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};