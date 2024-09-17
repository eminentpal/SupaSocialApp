import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from "../../contexts/AuthContext";
import Header from '../../components/Header';
import { useRouter } from 'expo-router';
import { hp, wp } from '../../helpers/common';
import Icon from '../../assets/icons';
import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
const Profile = () => {
  const {user, setAuth} = useAuth();

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

  return (
    <ScreenWrapper bg="white">
      <UserHeader user={user} router={router} handleLogout={handleLogout} />
    </ScreenWrapper>
  )
}

const UserHeader=({user, router, handleLogout}) =>{
  return (
    <View style={{flex:1, backgroundColor:'white', paddingHorizontal:wp(4)}}>
      <View>
        <Header title="Profile" showBackButton={true} />
       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}> 
         <Icon name="logout" color={theme.colors.rose} />
       </TouchableOpacity>
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