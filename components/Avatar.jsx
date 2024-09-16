import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { Image } from 'expo-image'
import { hp } from '../helpers/common'

const Avatar = ({
   url,
   size=hp(4.5),
   rounded=theme.radius.md,
   style={}
}) => {
  return (
    <View>
    <Image source={{url}}
    transition={100}
    style={[styles.avatar
        , 
        {height:size, width:size, borderRadius:rounded}, style]}
    />
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({})