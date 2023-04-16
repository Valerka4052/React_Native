import { View, Text,Image } from "react-native"
import { styles } from "./style";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export function CommentsScreen({ route }) {
    const { picture } = route.params.item;
    return (
        <View style={{ flex: 1, display: 'flex', alignItems: 'center', paddingHorizontal: 16 }}>
            <Image style={{ width: 343, height: 240, borderRadius: 8, marginTop: 32, }} source={{ uri: picture }} />
        
            <View style={ {width: '100%'}}>
                <TextInput placeholder="Комментировать..."
                    placeholderTextColor={'#BDBDBD'}
                    multiline={true}
                    style={{ width: '100%', height: 50, borderRadius: 100, borderColor: '#E8E8E8',  borderWidth:1, backgroundColor: '#F6F6F6',fontSize: 16,color: '#212121',paddingTop: 16,paddingBottom: 15,paddingLeft: 16,paddingRight:42 }} />
                <TouchableOpacity style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: '#FF6C00', alignItems: 'center', padding: 10,position: 'absolute',right:8,bottom: 8}}>
                    <AntDesign name="arrowup" size={14} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};