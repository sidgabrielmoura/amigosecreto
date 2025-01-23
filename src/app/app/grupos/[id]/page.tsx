import { createClient } from "@/../utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TextRevealCard, TextRevealCardTitle } from "@/components/ui/text-reveal-card"

export default async function GrupoIdPage({ params }: { params: Promise<{ id: string }> }){

    const supabase = await createClient()
    const {data: authUser} = await supabase.auth.getUser()

    const groupId = (await params).id

    const { data, error } = await supabase.from('groups').select(`
        name,
        participants (*) 
    `).eq("id", groupId).single()

    if(error){
        return <p>Erro ao carregar o grupo</p>
    }

    const assignedParticipantId = data.participants.find((p) => authUser?.user?.email === p.email)?.assigned_to
    const assignedParticipant = data.participants.find((p) => p.id === assignedParticipantId)
    return(
        <>
            <main className="container mx-auto py-6 h-[90vh] flex items-center justify-center">
                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                        <div className="flex items-center justify-between ">
                            <CardTitle className="text-2xl">
                                Grupo{" "} 
                                <span className="font-thin">{data.name}</span>
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Informações do grupo e participantes
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <h2 className="text-xl font-semibold mb-4">Participantes</h2>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.participants.map((participant) => (
                                    <TableRow key={participant.id}>
                                        <TableCell className="py-3">{participant.name}</TableCell>
                                        <TableCell>{participant.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Separator className="my-6"/>

                        <TextRevealCard
                            text="passe o mouse para revelar"
                            revealText={assignedParticipant?.name}
                            className="w-full"
                        >
                            <TextRevealCardTitle>
                                Seu amigo secreto!
                            </TextRevealCardTitle>
                        </TextRevealCard>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}