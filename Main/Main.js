import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "../Navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshStatus } from "../redux/auth/authOprations";

export function Main() {
    const {stateChange} = useSelector(state => state.authorisation)
    const dispatch = useDispatch()

    useEffect(() => {dispatch(refreshStatus())},[dispatch])
     const route = useRoute(stateChange)
    return (
        <NavigationContainer>
            {route}
        </NavigationContainer>
    );
};