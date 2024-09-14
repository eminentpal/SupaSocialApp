import { View, Text, Button } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper'
import Loading from '../components/Loading'

export default function index() {


  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
         <Loading />
    </View>
  )
}