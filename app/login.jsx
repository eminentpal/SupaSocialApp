import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Home from '../assets/icons/Home'
import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'

const Login = () => {
  return (
    <ScreenWrapper>
     <StatusBar style="dark" />
     <View style={styles.container}>
        <BackButton />
     </View>
     
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({})