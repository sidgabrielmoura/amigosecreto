"use server"
import { createClient } from "@/../utils/supabase/server"
import { redirect } from "next/navigation";

export type RemoveGroupState = {
    success: null | boolean,
    message?: string,
}

export async function RemoveGroup(groupId: string): Promise<RemoveGroupState> {
    const supabase = await createClient();

    try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser.user) {
            return {
                success: false,
                message: "Erro ao verificar o usuário autenticado."
            }
        }

        const { data: group, error: groupError } = await supabase
            .from("groups")
            .select("owner_id")
            .eq("id", groupId)
            .single();

        if (groupError || group.owner_id !== authUser.user.id) {
            return {
                success: false,
                message: "Você não tem permissão para remover este grupo."
            };
        }

        const { error: deleteError } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId)
        
        if (deleteError) {
            return {
                success: false,
                message: "Erro ao remover o grupo."
            };
        }

        return {
            success: true,
            message: "Grupo removido com sucesso.",
        };

    } catch (error) {
        return {
            success: false,
            message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        };
    }
}
