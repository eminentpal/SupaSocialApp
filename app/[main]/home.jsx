import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'

//global variable
var limit = 10
const Home = () => {

    const {setAuth, user} = useAuth()
    const router = useRouter()
    const [posts, setPosts] = useState([])


    useEffect(() => {
      getPosts()
    }, [])

    const getPosts = async () =>{
      //call api here
       limit = limit + 10;

       console.log('fetch post limit', limit)
       let res = await fetchPosts(limit)
       if (res.success) {
         setPosts(res.data)
       }
    }
   
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
       {/* header */}
       <View style={styles.header}>
         <Text style={styles.title} >LinkUp</Text>
         <View style={styles.icons}>
           <Pressable onPress={()=> router.push('notifications')}>
              <Icon  name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
           </Pressable>

           <Pressable onPress={()=> router.push('[main]/newPost')}>
              <Icon  name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
           </Pressable>

           <Pressable onPress={()=> router.push('[main]/profile')}>
             <Avatar
             uri={user?.image}
             size={hp(4.3)}
             rounded={theme.radius.sm}
             style={{borderWidth:2}}
             />
           </Pressable>

         </View>
       </View>

      {/* posts */}

      <FlatList 
      data={posts}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listStyle}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <PostCard
       item={item}
       currentUser={user}
       router={router}
      
      />}
      
      ListFooterComponent={
         <View style={{marginVertical: posts.length == 0 ? 200: 30}}>
               <Loading />
            </View>     
      }

      />

      </View>
      {/* <Button title='logout' onPress={onLogout}/> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
     container:{
        flex: 1,
        //paddingHorizontal: wp(4)
     },
     header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom:10,
        marginHorizontal: wp(4),
     },
     title:{
        color:theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold,
     },
     avartaImage:{
        height:hp(3.2),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve:'continuous',
        borderColor: theme.colors.gray,
        borderWidth: 3,
     },
     icons:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap:18
     },
     listStyle:{
        paddingTop:20,
        paddingHorizontal:wp(4)
     },
     noPosts:{
        fontSize: hp(2),
        textAlign:'center',
        color:theme.colors.text
     },
     pill:{
        position: 'absolute',
        right: -10,
        top: -4,
        height: hp(2.),
        width:hp(2.2),
        justifyContent:'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight,
     },
     pillText:{
        color:'white',
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold,
     }



})