import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails, removeComment, removePost } from '../../services/postService';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import PostCard from '../../components/PostCard';
import {useAuth} from '../../contexts/AuthContext'
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { TouchableOpacity } from 'react-native';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../services/userService';
import { createNotification } from '../../services/notificationService';

const PostDetails = () => {

  const {postId} = useLocalSearchParams();
  const [post, setPost] = useState(null)
  const [startLoading, setStartLoading] = useState(true)
  const router = useRouter()
  const {user} = useAuth()
  const inputRef = useRef(null)
  const commentRef = useRef(null)
  const [loading, setLoading] = useState(false)
 
 const handleNewComment = async (payload) => {

  
      //console.log('new comment', payload.new)
      if (payload.new) {
        let newComment = {...payload.new};
        let res = await getUserData(newComment.userId);
        newComment.user = res.success? res.data: {};
        setPost(prevPost =>{
          return{
            ...prevPost,
            //we adding d newComment as first in d arrray of prevPost.comments
            comments: [newComment, ...prevPost.comments]
          }
        })
      }
 }


  useEffect(() => {

    //Realtime changes when we make new cooment on a post
    //row level realtime changes
    //if we dont listen to a specific postID it will
    //listen to all comments instead of by postID
    //check documentation on supabase site
    let commentChannel = supabase
     .channel('comments')
     .on('postgres_changes', {
       event:'INSERT',
       schema:'public', 
       table: 'comments',
       filter:`postId=eq.${postId}`
      }, handleNewComment)
    .subscribe()

    getPostDetails();

    return() => {
       supabase.removeChannel(commentChannel)
    }

  }, [])


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

      //send notification to post owner
     if (res.success) {
     
       //if the user id of d person that commented
        //is not equals to the post.id, meaning he is not the
        //one that owns d post, only den we send notification

      if (user.id!=post.userId) {
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title:'commented on your post',
          data: JSON.stringify({postId: post.id, commentId: res?.data?.id})

        }
         createNotification(notify)
      }
      //clear comment box
      inputRef?.current?.clear();
      commentRef.current = "";

     } else {
      Alert.alert('Comment', res.msg)
     }
  }

  const onDeleteComment = async (comment) =>{
    let res = await removeComment(comment?.id)

    if (res.success) {

      setPost(prevPost => {
       let updatedPost = {...prevPost}
       updatedPost.comments = updatedPost.comments.filter(c => c.id != comment.id)
       return updatedPost;
      })
   

    }
  }

  const onDeletePost = async (item) => {
    let res = await removePost(post.id)

    if(res.success){
      router.back()
    }else{
      Alert.alert('Post', res.msg)
    }
  }

  const onEditPost = async (item) => {
    router.back()
    router.push({pathname: 'newPost', params:{...item}})
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
      showDelete={true}
      onDelete={onDeletePost}
      onEdit={onEditPost}
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
              onDelete={onDeleteComment}
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