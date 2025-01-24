import { createClient } from "@/../utils/supabase/client"

export type LogoutState = {
    success: null | boolean,
    message?: string,
    redirectTo?: string
}

export async function Logout(): Promise<LogoutState> {
    try {
        
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        
        if (error) {
            return {
                success: false,
                message: "Não foi possível realizar o logout. Tente novamente.",
            }
        }else{
            return {
                success: true,
                message: "Logout realizado com sucesso!",
                redirectTo: "/login"
            }
        }

    } catch (err) {
        return {
            success: false,
            message: "Erro inesperado durante o logout",
        }
    }
}
