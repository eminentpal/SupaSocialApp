import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails } from '../../services/postService';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import PostCard from '../../components/PostCard';
import {useAuth} from '../../contexts/AuthContext'
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { TouchableOpacity } from 'react-native';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';

const PostDetails = () => {

  const {postId} = useLocalSearchParams();
  const [post, setPost] = useState(null)
  const [startLoading, setStartLoading] = useState(true)
  const router = useRouter()
  const {user} = useAuth()
  const inputRef = useRef(null)
  const commentRef = useRef(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {

     getPostDetails()
  },[])




  const getPostDetails = async () => {
    //fetch post details here
    let res = await fetchPostDetails(postId)
    if (res.success) setPost(res.data)
      setStartLoading(false)
  }

  const onNewComment = async() =>{
    //if nothing is typed in comment box and d button is cliced we return null

    if(!commentRef.current) return null;
     let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current
     }
     // create comment
     setLoading(true)
     let res = await createComment(data)
     setLoading(false);

     if (res.success) {
      //send notification to post owner
   console.log(res)
      //clear comment box
      inputRef?.current?.clear();
      commentRef.current = "";

     } else {
      Alert.alert('Comment', res.msg)
     }



  }

  //this prevent us from getting filter undefined error and also
  //so the likes on post can show
 if (startLoading) {
   return (
    <View style={styles.center}>
      <Loading />
    </View>
   )
 }

 if(!post){
  return(
    <View style={[styles.center, {marginTop:100,justifyContent:'flex-start'}]}>
      <Text style={styles.notFound}>Post not found.</Text>
    </View>
  )
 }

  return (
    <View style={styles.container}>
     <ScrollView showsVerticalScrollIndicator={false}
     contentContainerStyle={styles.list}
     >
      <PostCard

      //formerly before comment added
      //item={post}
      item={{...post, comments:[{count:post?.comments?.length}]}}
      
      currentUser={user}
      router={router}
      hasShadow={false}
      //we use dx to disbale the comment button from opening the 
      //post details card again when clicked.
      showMoreIcon = {false}
      />
       {/* {comment input} */}
     <View style={styles.inputContainer}>
       <Input
       inputRef={inputRef}
       onChangeText={value => commentRef.current = value}
       placeholder="Type comment..."
       placeholderTextColor={theme.colors.textLight}
       containerStyle ={{flex:1, height:hp(6.2), borderRadius:theme.radius.xl}}
       />
       {
        loading ? (
         <View style={styles.loading}>
           <Loading size='small' />
           </View>
        ) : (
        <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name="send" color={theme.colors.primaryDark} />
       </TouchableOpacity>
        )
       }
       
     </View>
    {/* comment list */}
    <View style={{marginVertical:15, gap:17}}>
      {
        post?.comments?.map(comment => <CommentItem
             item={comment}
             key={comment?.id?.toString()}
             canDelete={user.id == comment.userId || user.id == post.userId}
          />)
      }
      {
        post?.comments?.length == 0 && (
          <Text style={{color: theme.colors.text, marginLeft:5}}>
            Be the first to comment!
          </Text>
        )
      }
    </View>
     </ScrollView>
    
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
   container:{
    flex:1,
    backgroundColor:'white',
    paddingVertical: wp(7)
   },
   inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap:10
   },
   list:{
    paddingHorizontal:wp(4),

   },
   sendIcon:{
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor:theme.colors.primary,
    borderRadius:theme.radius.lg,
    borderCurve: 'continuous',
    height:hp(5.8),
    width:hp(5.8)
   },
   center:{
    flex: 1,
    alignItems:'center',
    justifyContent: 'center'
   },
   notFound:{
    fontSize:hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium
   },
   loading:{
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{scale:1.3}]
   }


}) 