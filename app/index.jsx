import { View, Text, Button } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper'

export default function index() {

  const router = useRouter()
  return (
    <ScreenWrapper>
      <Text style={{color:theme.colors.primary}} >index</Text>
      <Button title='welcome' onPress={()=> router.push('/welcome')} />
    </ScreenWrapper>
  )
}