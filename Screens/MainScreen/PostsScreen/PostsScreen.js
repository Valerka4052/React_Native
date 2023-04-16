import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../../NestedScreen/Home/Home';
import { MapScreen } from '../../NestedScreen/MapScreen/MapScreen';
import { CommentsScreen } from '../../NestedScreen/CommentsScreen/CommentsScreen';
// import { styles } from "./style";

const PostsStack = createNativeStackNavigator();

export function PostsScreen() {
    return (
        <PostsStack.Navigator >
            <PostsStack.Screen options={{ headerShown: false }} name="Home" component={Home} />
            {/* <PostsStack.Screen options={{ headerShown: false }} name="Карта" component={MapScreen} /> */}
            <PostsStack.Screen options={{ headerShown: false }} name="Коментарии" component={CommentsScreen} />
        </PostsStack.Navigator>
    );
};