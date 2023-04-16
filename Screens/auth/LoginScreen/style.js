import { StyleSheet } from "react-native";

const textColor = 'black'

export const styles = StyleSheet.create({
    backgrounImageCon5tainer: {
        flex: 1,
        // width: '100%',
        justifyContent: 'flex-end'
    },
    formBox: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16
    },
    profileImageContainer: {
        position: 'absolute',
        top: -60
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 16,
    },
    profileButton: {
        position: 'absolute',
        bottom: 12,
        right: -12
    },
    mainText: {
        fontFamily: 'roboto',
        fontWeight: 500,
        fontSize: 30,
        lineHeight: 35,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 2,
        padding: 12,
        borderRadius: 8,
        borderColor: textColor,
        fontFamily: 'roboto',
        color: textColor,
        backgroundColor: '#F6F6F6'
    },
    text: {
        color: textColor,
        fontFamily: 'roboto',
        fontSize: 20
    },
    title: {
        fontFamily: 'roboto',
        color: textColor,
        alignSelf: 'center',
        marginTop: 80,
        fontSize: 30,
    },
    btn: {
        padding: 16,
        borderRadius: 100,
        backgroundColor: '#FF6C00',
        borderWidth: 0,
        alignItems: 'center',
        width: '100%'
    },
    BtnText: {
        fontFamily: 'roboto',
        fontSize: 16,
        color: textColor
    },
    changeVisible: {
        position: 'absolute',
        right: 40,
        top: 15
    },
});