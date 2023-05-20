import Lottie from 'lottie-react-native';
import { useEffect, useRef } from 'react';



export function Loader() {
        const anim = useRef(null);
    useEffect(() => {
           if(anim){
        setTimeout(() => {
            anim.current.play();
        }, 0)}
    }, [])

    return (
       <Lottie ref={anim}  source={require('../assets/loading.json')} autoPlay loop speed={3} style={{ flex: 1 }} />
    );
};