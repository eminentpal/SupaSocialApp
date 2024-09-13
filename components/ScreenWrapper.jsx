import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//we wrap our component with this wrappper to
//make our app responsive and prevent our app from
//blocked on device tht have notch, eg iphone.
//bg - background

export default function ScreenWrapper({children,bg}) {
  
    const {top} = useSafeAreaInsets();
    //if the top is greater than 0 that means
    //the devic has a notch

    

    const paddingTop = top >0 ? top +5: 30;
    return (
    <View style={{flex:1, paddingTop, backgroundColor:bg }}>
       
        {
            children
        }
  
    </View>
  )
}