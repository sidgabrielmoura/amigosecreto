import { createClient } from "@/../utils/supabase/server"
import NewGroupForm from "@/components/new-group-form"

export default async function NewGroupPage(){
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    const loggedUser = {
        id: data?.user?.id as string,
        email: data?.user?.email as string
    }

    return(
        <div className="w-full h-[90vh] flex items-center justify-center px-2">
            <NewGroupForm loggedUser={loggedUser}/>
        </div>
    )
}