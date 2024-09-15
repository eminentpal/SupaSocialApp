import { supabase } from "../lib/supabase"

export const getUserData = async (userId) => {
    try {
        const{ data, error} = await supabase
       //this block is sql code for gettimg single record
        .from('users')
        .select()
        .eq('id', userId)
        .single()
        if(error){
            return {success: false, msg: error?.message}
        }
        return {success: true, data}
    } catch (error) {
        console.log('get error:', error)
        return {success: false, msg: error.message}
    }
}