import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchNotifications } from '../../services/notificationService'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import ScreenWrapper from '../../components/ScreenWrapper'
import {  useRouter } from 'expo-router'
import NotificationItem from '../../components/NotificationItem'

const Notifications = () => {

   const [notifications, setnotifications] = useState([])
    const {user} = useAuth();
    const router = useRouter()

  useEffect(() =>{
    getNotifications()
  },[])

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id);

    if(res.success) setnotifications(res.data)
      console.log(notifications)

  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false} > 
         {
          notifications.map(item=>{
            return(
              <NotificationItem
               item={item}
               key={item?.id}
               router={router}
              />
            )
          })
         }
         {
          notifications.length==0 &&(
            <Text style={styles.noData}>No notifications yet</Text>
          )
         }
        </ScrollView>

      </View>
    </ScreenWrapper>
  )
}
 
export default Notifications

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:wp(4)

  },
  listStyle:{
    paddingVertical:20,
    gap:10
  },
  noData:{
    fontSize:hp(1.8),
    fontWeight: theme.fonts.medium,
    color:theme.colors.text,
    textAlign:'center'
  }
})