"use server"
import { createClient } from "@/../utils/supabase/server"
import { useToast } from "@/hooks/use-toast"
import { redirect } from "next/navigation"

export type CreateGroupState = {
    success: null | boolean,
    message?: string
}

export async function createGroup(
    _previousState: CreateGroupState,
    formData: FormData
): Promise<CreateGroupState> {
    const supabase = await createClient();

    try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError) {
            return {
                success: false,
                message: 'Ocorreu um erro ao criar o grupo'
            };
        }

        const names = formData.getAll("name");
        const emails = formData.getAll("email");
        const groupName = formData.get("group-name") as string;

        if (!groupName || !names.length || !emails.length) {
            return {
                success: false,
                message: "Dados inválidos para criação do grupo.",
            };
        }

        const { data: newGroup, error } = await supabase.from("groups").insert({
            name: groupName,
            owner_id: authUser.user.id
        })
        .select()
        .single();

        if (error) {
            return {
                success: false,
                message: "Ocorreu um erro ao criar um grupo. Por favor, tente novamente"
            };
        }

        const participants = names.map((name, index) => ({
            group_id: newGroup.id,
            name: name as string,
            email: emails[index] as string
        }));

        const { data: createdParticipants, error: errorParticipants } = await supabase.from("participants").insert(participants).select();

        if (errorParticipants) {
            return {
                success: false,
                message: "Ocorreu um erro ao adicionar os participantes ao grupo. Por favor, tente novamente"
            };
        }

        const drawnParticipants = drawGroup(createdParticipants);

        const { error: errorDraw } = await supabase.from("participants").upsert(drawnParticipants);
        if (errorDraw) {
            return {
                success: false,
                message: "Ocorreu um erro ao sortear os participantes. Por favor, tente novamente"
            };
        }

        return {
            success: true,
            message: `Grupo '${groupName}' criado com sucesso!`,
        };

    } catch (error) {
        return {
            success: false,
            message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        };
    }
}

type Participant = {
    id: string,
    group_id: string,
    name: string,
    email: string,
    assigned_to: string | null,
    created_at: string
}

const drawGroup = (participants: Participant[]) => {
    const selectedParticipants: string[] = []

    return participants.map((participant) => {
        const availableParticipants = participants.filter((p) => p.id !== participant.id && !selectedParticipants.includes(p.id))

        if (availableParticipants.length === 0) {
            throw new Error("Não há participantes disponíveis para sortear.");
        }

        const assignedParticipant = availableParticipants[
            Math.floor(Math.random() * availableParticipants.length)
        ]

        selectedParticipants.push(assignedParticipant.id)

        return {
            ...participant,
            assigned_to: assignedParticipant.id
        }
    })

}