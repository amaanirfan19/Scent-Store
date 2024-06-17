'use server'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function deleteScent(formData){
    const scentId = formData.get('id')

    const cookieStore = cookies()
    const supabase = createServerComponentClient({cookies: () => cookieStore})
    const {data: {session}} = await supabase.auth.getSession()
    const user = session?.user

    if (!user){
        console.error('User is not authenticated within deleteScent sever action')
        return;
    }

    const {data, error} = await supabase
        .from('scents')
        .delete()
        .match({id: scentId, user_id: user.id})
    
    if (error){
        console.error('Error inserting data', error)
        return;
    }

    revalidatePath('/scent-list')

    return {message: 'Success'}
}