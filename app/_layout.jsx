import { View, Text, LogBox } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'


// we use this to ignore pop up warning messages on our app

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning:MemoizedTNodeRenderer', 'Warning: TRenderEngineProvider'])

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
  
  const {setAuth, setUserData} = useAuth()
  const router = useRouter()

   useEffect(() => {
     supabase.auth.onAuthStateChange((_event, session) =>{
        //console.log('session user:', session?.user);

        if (session) {
          //set auth

          setAuth(session?.user)
          updateUserData(session?.user, session?.user.email)
         
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
   
   const updateUserData = async (user, email) =>{
      let res = await getUserData(user?.id);
      if(res.success) setUserData({...res.data, email})
     
   }


  return (
    <Stack
    screenOptions={{
        headerShown:false
    }}
    />
  )
}

export default _layout