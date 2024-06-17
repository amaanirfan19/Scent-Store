'use server'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function updateScent(formData){
    const id = formData.get('id')
    const model = formData.get('model')
    const brand = formData.get('brand')
    const referenceNumber = formData.get('referenceNumber')

    const cookieStore = cookies()
    const supabase = createServerComponentClient({cookies: () => cookieStore})
    const {data: {session}} = await supabase.auth.getSession()
    const user = session?.user

    if (!user){
        console.error('User is not authenticated within updateScent sever action')
        return;
    }

    const {data, error} = await supabase
        .from('scents')
        .update(
            {
                model,
                brand,
                reference_number: referenceNumber,
                
            }
        ).match({id, user_id: user.id})

    
    if (error){
        console.error('Error updating data', error)
        return;
    }

    revalidatePath('/scent-list')

    return {message: 'Success'}
}