import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
    try {
        //upload image

        if(post.file && typeof post.file == 'object'){
            let isImage = post?.file.type == 'image';
            let folderName = isImage ? 'postImages' : 'postVideos'
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
            if (fileResult.success) {
                post.file = fileResult.data
            } else{
                return fileResult;
            }
       
        }
        const {data, error} = await supabase
        .from('posts')
        .upsert(post)
        .select()
        .single();

        if(error){
            console.log('createPost error:', error);
            return {success: false, msg: 'Could not create your post!'}
        }

        return { success:true, data: data};
        
    } catch (error) {
        console.log('createPost error:', error);
        return {success: false, msg: 'Could not create your post!'}
    }
}



export const fetchPosts  = async (limit=10) => {
    try {

        const {data, error} = await supabase
        .from('posts')
        //we select * meaning all posts den also d user's info, like, comments
        .select(`*,
            user: users(id,name,image),
            postLikes (*),
            comments(count)
            `)
        .order('created_at', {ascending:false})
        .limit(limit);

    

        if (error) {
            console.log('fetchPost error:', error);
        return {success: false, msg: 'Oops! Could not fetch your posts'}
        }

        return {success: true, data:data};
       
        
    } catch (error) {
        console.log('fetchPost error:', error);
        return {success: false, msg: 'Could not fetch your posts'}
    }
}

export const fetchPostDetails  = async (postId) => {
    try {

        const {data, error} = await supabase
        .from('posts')
        //we select * meaning all posts den also d user's info
        .select(`*,
            user: users(id,name,image),
            postLikes (*),
            comments (*, user: users(id, name, image))
            `)
        .eq('id', postId)
        //added .order after implementing comment functionality
        .order("created_at", {ascending: false, foreignTable: "comments"})
        .single();

    

        if (error) {
            console.log('fetchPostDetails error:', error);
        return {success: false, msg: 'Oops! Could not fetch your post'}
        }

        return {success: true, data:data};
       
        
    } catch (error) {
        console.log('fetchPostDetails error:', error);
        return {success: false, msg: 'Could not fetch your post'}
    }
}

export const createPostLike = async (postLike) => {
    try {

        const {data, error} = await supabase
        .from('postLikes')
        .insert(postLike)
        .select()
        .single();

        if (error) {
            console.log('postLike error:', error);
        return {success: false, msg: 'Oops! Could not like your post'}
        }

        return {success: true, data:data};
       
        
    } catch (error) {
        console.log('postLike error:', error);
        return {success: false, msg: 'Could not like your post'}
    }
}


export const removePostLike = async (postId, userId) => {
    try {

        const {error} = await supabase
        .from('postLikes')
        .delete()
        //comparing if userID we passied is same with any id
        //in d postLike table
        .eq('userId', userId)
        //same comparison also for post ID.
        .eq('postId', postId)
        

        if (error) {
            console.log('postLike error:', error);
        return {success: false, msg: 'Oops! Could not remove your post like.'}
        }

        return {success: true};
       
        
    } catch (error) {
        console.log('postLike error:', error);
        return {success: false, msg: 'Could not remove your post like.'}
    }
}

export const removeComment = async (commentId) => {
    try {

        const {error} = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

        if (error) {
            console.log('removeComment error:', error);
        return {success: false, msg: 'Oops! Could not remove the comment.'}
        }

        return {success: true, data:{commentId}};
       
        
    } catch (error) {
        console.log('removeComment error:', error);
        return {success: false, msg: 'Could not remove the comment.'}
    }
}

export const createComment = async (comment) => {
    try {

        const {data, error} = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();

        if (error) {
            console.log('comment error:', error);
        return {success: false, msg: 'Oops! Could not create your post'}
        }

        return {success: true, data:data};
       
        
    } catch (error) {
        console.log('comment error:', error);
        return {success: false, msg: 'Could not comment your post'}
    }
}