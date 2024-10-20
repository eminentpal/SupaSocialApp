import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from "../../contexts/AuthContext";
import Header from '../../components/Header';
import { useRouter } from 'expo-router';
import { hp, wp } from '../../helpers/common';
import Icon from '../../assets/icons';
import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import Avatar from '../../components/Avatar';
import { fetchPosts } from '../../services/postService';
import PostCard from '../../components/PostCard';
import Loading from '../../components/Loading';

//global variable
var limit = 0
const Profile = () => {
  const {user, setAuth} = useAuth();
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const router = useRouter()



  const onLogout = async () => {
    //no need for set auth to null since we doing that at layout page

  // setAuth(null);
   const {error} = await supabase.auth.signOut();
   if(error) {
       Alert.alert('Sign out', "Error signing out!")
   }
}



const handleLogout= async () => {
   //show confirm modal
   Alert.alert('Confirm', 'Are you sure you want to log out?', [
    {
      text:'Cancel',
      onPress:() => console.log('Modal cancelled'),
      style:'cancel'
    },
    {
      text:'Logout',
      onPress:() => onLogout(),
      style:'destructive'
    }
   ])
}


const getPosts = async () =>{

  //call api here
  if(!hasMore) return null;
   limit = limit + 10;

   console.log('fetch post limit', limit)
   let res = await fetchPosts(limit, user.id)
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
      <FlatList 
      ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout} />}
      ListHeaderComponentStyle={{marginBottom:30}}
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
         <View style={{marginVertical: posts.length == 0 ? 100: 30}}>
               <Loading />
            </View>     
  ) : (
   <View style={{marginVertical:30}}>
      <Text style={styles.noPosts}>No more posts!</Text>
   </View>
   )}

      />
      
    </ScreenWrapper>
  )
}

const UserHeader=({user, router, handleLogout}) =>{
  return (
    <View style={{flex:1, backgroundColor:'white', paddingHorizontal:wp(4)}}>
      <View>
        <Header title="Profile" mb={30} />
       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}> 
         <Icon name="logout" color={theme.colors.rose} />
       </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={{gap:15}}>
          <View style={styles.avatarContainer }>
          <Avatar 
          uri={user?.image}
           size={hp(12)}
           rounded={theme.radius.xxl*1.4}
          />
          <Pressable style={styles.editIcon} onPress={()=>router.push('[main]/editProfile')}>
            <Icon name="edit" strokeWidth={2.5} size={20} />
          </Pressable>
          </View>
        {/* username and address */}
        <View style={{alignItems: 'center',gap:4}}>
          <Text style={styles.userName}>
            {user && user.name}
          </Text>
          <Text style={styles.infoText}>
            {user && user.address}
          </Text>
        </View>
        {/* email, phone bio */}
        <View style={{gap:10}}>
           <View style={styles.info}>
            <Icon name="mail" size={20} color={theme.colors.text} />
            <Text style={styles.infoText}>
              {user && user.email}
            </Text>
           </View>

          {
            user && user?.phoneNumber && (
              <View style={styles.info}>
              <Icon name="call" size={20} color={theme.colors.text} />
              <Text style={styles.infoText}>
                {user && user.phoneNumber}
              </Text> 
             </View>
            )
          }

          {
            user && user.bio && (
              <Text style={styles.infoText}> {user.bio}</Text>
            )
          }
        </View>
        </View>
      </View>
    </View>
  )
}
export default Profile

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  headerContainer:{
    marginHorizontal: wp(4),
    marginBottom:20
  },
  headerShape:{
    width: hp(100),
    height:(20)
  },
  avatarContainer:{
    height:hp(12),
    width:hp(12),
    alignSelf: 'center',
  },
  editIcon:{
    position:'absolute',
    bottom:0,
    right:-12,
    padding:-12,
    padding:7,
    borderRadius: 50,
    backgroundColor:'white',
    shadowColor:theme.colors.textLight,
    shadowOffset:{width:0, height:4},
    shadowOpacity:0.4,
    shadowRadius:5,
    elevation:7
  },
  userName:{
    fontSize:hp(3),
    fontWeight:'500',
    color:theme.colors.textDark
  },
  info:{
    flexDirection: 'row',
    alignItems: 'center',
    gap:10
  },
  infoText:{
    fontSize: hp(1.6),
    fontWeight: '500',

  },
  logoutButton:{
    position:'absolute',
    right:0,
    padding:5,
    borderRadius: theme.radius.sm,
    backgroundColor:'#fee2e2'
  },
  listStyle:{
    paddingHorizontal:wp(4),
    paddingBottom:30
  },
  noPosts:{
    fontSize: hp(2),
    textAlign:'center',
    color:theme.colors.text
  }
})