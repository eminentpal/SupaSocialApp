import { Dimensions } from "react-native";



//Thisblockof codes is for making our app responsive

const {width:deviceWidth, height:deviceHeight} = Dimensions.get('window');

//hp means height percentage
export const hp = percentage => {
    return (percentage * deviceHeight) / 100;
}

export const wp = percentage => {
    return (percentage * deviceWidth) / 100;
}