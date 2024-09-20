import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { getUserImageSrc } from '../../services/imageService'
import { Image } from 'expo-image'
import Icon from '../../assets/icons'
import  Input  from "../../components/Input";

const EditProfile = () => {

    const {user} = useAuth()

    let imageSource = getUserImageSrc(user.image);

    const onPickImage = async () => {

    }
  
  
    return (
    <ScreenWrapper>
     <View style={styles.container}>
       <ScrollView style={{flex:1}}>
        <Header title="Edit Profile" />
        {/* form */}
        <View style={styles.form}>
           <View style={styles.avatarContainer}>
             <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon}>
                <Icon name="camera" size={20}strokeWidth={2.5} onPress={onPickImage}  />
              </Pressable>
           </View>
           <Text style={{fontSize:hp(1.5), color:theme.colors.text}}>
            Please fill your profile details
           </Text>
           <Input  
            icon={<Icon name="user" />}
            placeholder ='Enter your name'
            value={null}
            onChangeText={value =>{}}
           />
        </View> 
       </ScrollView>
     </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal: wp(4)

    },
    avatarContainer:{
        height:hp(14),
        width: hp(14),
        alignSelf:'center'
    },
    avatar:{
        width:'100',
        height:'100%',
        borderRadius:theme.radius.xxl*1.8,
        borderCurve:'continuous',
        borderWidth:1,
        borderColor: theme.colors.darkLight,
    },
    cameraIcon:{
        position:'absolute',
        bottom:0,
        right:-10,
        padding:8,
        borderRadius:50,
        backgroundColor:'white',
        shadowColor:theme.colors.textLight,
        shadowOffset:{width: 0, height:4},
        shadowOpacity:0.4,
        shadowRadius:5,
        elevation:7
    },
    form:{
        gap:18,
        marginTop:20
    },
    input:{
        flexDirection: 'row',
        borderWidth:0.4,
        borderColor:theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve:'continuous',
        padding:17,
        paddingHorizontal:20,
        gap:15
    },
    bio:{
        flexDirection:'row',
        height: hp(15),
        alignItems:'flex-start',
        paddingVertical:15
    }
})