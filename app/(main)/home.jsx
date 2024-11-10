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
import { getUserData } from '../../services/userService'

//global variable
var limit = 0
const Home = () => {

    const {setAuth, user} = useAuth()
    const router = useRouter()
    const [posts, setPosts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [notificationCount, setnotificationCount] = useState(0)

    const handlePostEvent = async (payload) => {
       if(payload.eventType == 'INSERT' && payload?.new?.id){
         let newPost = {...payload.new};
         let res = await getUserData(newPost.userId);
         //we added this two line to fix unhandled error when 
         //we make a new post
         newPost.postLikes = []
         newPost.comments = [{count: 0}]

         
         //if success we set the post to d data else empty object
         newPost.user = res.success ? res.data : {}
         //we putting new post first bfr prevPosts 
         //cus we want the new post to be first on the list
         setPosts(prevPosts => [newPost, ...prevPosts])

       } 

       if (payload.eventType =='DELETE' && payload.old.id) {
         setPosts (prevPosts => {
            let updatedPosts = prevPosts.filter(post=> post.id != payload.old.id)
            return updatedPosts
         })
       }

       //for update post

       if(payload.eventType == 'UPDATE' && payload?.new?.id){
         setPosts(prevPosts => {
            let updatedPosts = prevPosts.map(post =>{
               if (post.id == payload.new.id) {
                  post.body = payload.new.body;
                  post.file = payload.new.file
               }
               return post
            });
            return updatedPosts;
         })

       } 
    }

    

  const handleNewNotification = async (payload) => {
   if (payload.eventType === 'INSERT' && payload.new.id) {
      setnotificationCount(prev => prev+1) 
   }
  }


   //  const handleNewPostComment = async (payload) => {

   //    console.log('hh',payload.new)
      

   //    // if( payload.new){
   //    //    let newComment = {...payload.new};
   //    //    let res = await getUserData(newPost.userId);
   //    //    //if success we set the post to d data else empty object
   //    //    newPost.user = res.success ? res.data : {}
   //    //    //we putting new post first bfr prevPosts 
   //    //    //cus we want the new post to be first on the list
   //    //    setPosts(prevPosts => [newPost, ...prevPosts])
   //    //  } 
  
   // }
    useEffect(() => {

      //Realtime changes when we make new post
      let postChannel = supabase
       .channel('post')
       .on('postgres_changes', {event:'*', schema:'public', table: 'posts'}, handlePostEvent)
      .subscribe()

      // let newpostcommentChannel = supabase
      //  .channel('post')
      //  .on('postgres_changes', {event:'INSERT', schema:'public', table: 'comments'}, handleNewPostComment)
      // .subscribe()
      
      //this function was removed cus we calling it on the flatlist
      //getPosts()

      //Realtime changes when a new notification drops
      let notificationChannel = supabase
       .channel('notifications')
       .on('postgres_changes', {event:'INSERT', schema:'public', table: 'notifications', filter: `receiverId = eq.${user.id}`}, handleNewNotification)
      .subscribe()


      return() => {
         supabase.removeChannel(postChannel)
         // supabase.removeChannel(newpostcommentChannel)
         supabase.removeChannel(notificationChannel)
      }

  
    }, [])

    const getPosts = async () =>{

      //call api here
      if(!hasMore) return null;
       limit = limit + 10;

       console.log('fetch post limit', limit)
       let res = await fetchPosts(limit)
       if (res.success) {
         //the hasmore let us know when we reach limit
         //of posts in d list.
         if(posts.length == res.data.length){
            setHasMore(false)
         }
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
           <Pressable onPress={()=> {
            setnotificationCount(0)
            router.push('notifications')
            }}>
              <Icon  name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
             {
               notificationCount > 0 && (
                  <View style={styles.pill}>
                    <Text style={styles.pill}>
                     {notificationCount}
                    </Text>
                  </View>
               )
             }
           </Pressable>

           <Pressable onPress={()=> router.push('newPost')}>
              <Icon  name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
           </Pressable>

           <Pressable onPress={()=> router.push('profile')}>
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

      //this is for pagination
      onEndReached={() =>{
         getPosts()

      }}
      onEndReachedThreshold={0}
      
      ListFooterComponent={ hasMore ?(
         <View style={{marginVertical: posts.length == 0 ? 200: 30}}>
               <Loading />
            </View>     
  ) : (
   <View style={{marginVertical:30}}>
      <Text style={styles.noPosts}>No more posts!</Text>
   </View>
   )}

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