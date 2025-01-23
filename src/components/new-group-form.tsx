"use client"

import { useActionState, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader, Mail, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { createGroup, CreateGroupState } from "@/app/app/grupos/novo/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"

interface Participant {
    name: string,
    email: string
}

export default function NewGroupForm({ loggedUser }: { loggedUser: { email: string; id: string } }) {
    const router = useRouter();
    const toast = useToast()

    const [participants, setParticipants] = useState<Participant[]>([
        {name: '', email: loggedUser.email},
    ])

    const [groupName, setGroupName] = useState("")

    useEffect(() => {
        const storedParticipants = localStorage.getItem("participants");
        if (storedParticipants) {
            setParticipants(JSON.parse(storedParticipants));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("participants", JSON.stringify(participants));
    }, [participants])

    const [state, formAction, pending] = useActionState<CreateGroupState, FormData>(createGroup, {
        success: null,
        message: ""
    })

    useEffect(() => {
        if (state.success && state.redirectTo) {
            router.push(state.redirectTo)
        }
    }, [state, router])

    const [errors, setErrors] = useState<Record<number, string>>({});
    const updateParticipant = (index: number, field: keyof Participant, value: string) => {

        const updatedParticipants = [...participants]
        const updatedErrors = { ...errors };

        if (field === "email") {
            const emailAlreadyExists = updatedParticipants.some(
                (participant, i) => participant.email === value && i !== index
            );
    
            if (emailAlreadyExists) {
                updatedErrors[index] = "Este email já está sendo usado por outro participante";
                setErrors(updatedErrors);
                return;
            }
    
            if (value === loggedUser.email) {
                updatedErrors[index] = "O email do administrador do grupo não pode ser repetido";
                setErrors(updatedErrors);
                return;
            }
        }
        delete updatedErrors[index];
        setErrors(updatedErrors)
        
        updatedParticipants[index][field] = value
        setParticipants(updatedParticipants)
    }

    const removeParticipant = (index: number) => {
        setParticipants(participants.filter((_, i) => i !== index))
    }

    const addParticipant = () => {
        setParticipants(participants.concat({name: "", email: ""}))
    }

    useEffect(() => {
        if(state.success === false){
            toast.toast({
                title: "Erro!",
                description: state.message,
                variant: "destructive"
            })
        }
    }, [state])

    return(
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Novo Grupo</CardTitle>
                <CardDescription>Convide seus amigos para participar</CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4 max-h-[350px] overflow-y-auto">
                    <div className="space-y-2">
                        <Label htmlFor="group-name">Nome do grupo</Label>
                        <Input id="group-name" name="group-name" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Digite o nome do grupo" required/>
                    </div>

                    <h2 className="!mt-12">Participantes</h2>
                    {participants.map((participant, index) => (
                        <div key={index}>
                            <div className="flex flex-col md:flex-row gap-3 items-end">
                                <div className="flex-grow space-y-2 w-full">
                                    <Label htmlFor={`name-${index}`}>Nome</Label>
                                    <Input 
                                        id={`name-${index}`} 
                                        name="name" 
                                        value={participant.name}
                                        placeholder="digíte o nome do seu amigo" 
                                        onChange={(e) => {updateParticipant(index, "name", e.target.value)}}
                                        required
                                    />
                                </div>

                                <div className="flex-grow space-y-2 w-full">
                                    <Label htmlFor={`email-${index}`}>Email</Label>
                                    <Input 
                                        type="email" 
                                        placeholder="digíte o email do seu amigo"
                                        id={`email-${index}`} 
                                        name="email" 
                                        value={participant.email} 
                                        onChange={(e) => {updateParticipant(index, "email", e.target.value)}}
                                        className="read-only:text-muted-foreground"
                                        readOnly={participant.email === loggedUser.email}
                                        required
                                    />
                                </div>

                                <div className="min-w-9">
                                    {participants.length > 1 && participant.email !== loggedUser.email && (
                                        <Button type="button" variant={"outline"} size={"icon"} onClick={() => removeParticipant(index)}>
                                            <Trash2 className="size-4"/>
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            {errors[index] && (
                                <div className="text-red-600 text-[12px] flex justify-end mt-3">{errors[index]}</div>
                            )}

                        </div>
                    ))}
                </CardContent>

                <Separator className="my-4"/>

                <CardFooter className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                    <Button type="button" variant={"outline"} onClick={addParticipant} className="w-full md:w-auto">
                        Adicionar amigo
                    </Button>

                    <Button type="submit" className="w-full md:w-auto space-x-2 flex items-center">
                        <Mail className="size-3"/>
                        Criar grupos e enviar emails
                        {pending  && <Loader className="size-3 animate-spin"/>}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}