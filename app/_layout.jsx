import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'


// we change layout to mainlayout and created
//a separate block of code for _layout
//cus we want to wrap our app with a 
//authprovider

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

const MainLayout = () => {
  
  const {setAuth} = useAuth()
  const router = useRouter()

   useEffect(() => {
     supabase.auth.onAuthStateChange((_event, session) =>{
        console.log('session user:', session?.user);

        if (session) {
          //set auth

          setAuth(session?.user)
         
          //move to home screen
          //using router.replace prevent users
          //from going back to the screen that
          //was replaced
          router.replace('[main]/home')
        } else {
          //set auth null
          setAuth(null)
          //move to welcome screeen
          router.replace('welcome')
        }
     })
   }, [])
   


  return (
    <Stack
    screenOptions={{
        headerShown:false
    }}
    />
  )
}

export default _layout