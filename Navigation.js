import { RegistrationScreen } from './Screens/auth/RegistrationScreen/RegistrationScreen';
import { LoginScreen } from "./Screens/auth/LoginScreen/LoginScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CreateScreen } from "./Screens/MainScreen/CreateScreen/CreateScreen";
import { Home } from './Screens/NestedScreen/Home/Home';
import { ProfileScreen } from './Screens/MainScreen/ProfileScreen/ProfileScreen';
import { PostsScreen } from './Screens/MainScreen/PostsScreen/PostsScreen';

import { MaterialIcons, MaterialCommunityIcons, Fontisto, FontAwesome5  } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { AntDesign,Feather,SimpleLineIcons} from '@expo/vector-icons';
import { signOutUser } from './redux/auth/authOprations';
import { useDispatch } from 'react-redux';

const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();

export function useRoute(online) {
    const dispatch = useDispatch();
    if (online) {
        return (<MainTab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarItemStyle: {}, }}        >
                        <MainTab.Screen options={{
                headerRight: () => (
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('signout');
                                        dispatch(signOutUser())
                                }} style={{ paddingRight: 16 }} >
                        <Feather name="log-out" size={24} color="#BDBDBD" />
                    </TouchableOpacity>
                ),
                tabBarLabel: 'Posts',
                tabBarIcon: ({ focused, color, size }) => {
                    if (!focused) return <SimpleLineIcons name="grid" size={14} color={'#212121'}
                        style={{
                            backgroundColor: '#fff',
                        }}
                    />
                    return <SimpleLineIcons name="grid" size={14} color={'#fff'}
                        style={{
                            backgroundColor: '#FF6C00',
                            borderRadius: 40,
                            paddingTop: 5,
                            paddingBottom: 5,
                            paddingHorizontal: 15,
                        }}
                    />
                },
            }}
                name="Публикации"
                component={PostsScreen}
            />

            <MainTab.Screen
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <TouchableOpacity style={{ paddingLeft: 16 }} onPress={() => { navigation.goBack(); }}>
                            <Feather name="arrow-left" size={24} color="#2a2a2a" />
                        </TouchableOpacity>
                    ),
                    tabBarIcon: ({ focused, color, size }) => {
                        if (!focused) return <AntDesign name="plus" size={14} color={'#212121'}
                            style={{
                                backgroundColor: '#fff',
                            }}
                        />
                        return <AntDesign name="plus" size={14} color={'#fff'}
                            style={{
                                backgroundColor: '#FF6C00',
                                borderRadius: 40,
                                paddingTop: 5,
                                paddingBottom: 5,
                                paddingHorizontal: 15,
                            }}
                        />
                    },
                })}
                name="Создать публикацию"
                component={CreateScreen}
            />

            <MainTab.Screen
                options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ focused, color, size }) => {
                    if (!focused) return <Feather name="user" size={14} color={'#212121'}
                        style={{
                            backgroundColor: '#fff',
                        }}
                    />
                    return <Feather name="user" size={14} color={'#fff'}
                        style={{
                            backgroundColor: '#FF6C00',
                            borderRadius: 40,
                            paddingTop: 5,
                            paddingBottom: 5,
                            paddingHorizontal: 15,
                        }}
                    />
                },
            }}
                name="Профиль"
                component={ProfileScreen}
            />
        </MainTab.Navigator>
        )
    };
    return (
        <AuthStack.Navigator >
            <AuthStack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
            <AuthStack.Screen options={{ headerShown: false }} name="Register" component={RegistrationScreen} />
        </AuthStack.Navigator>
    );
};

