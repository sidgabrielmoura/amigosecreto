import { createClient } from "@/../utils/supabase/server"
import RemoveGroupButton from "@/components/removeGroupButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar, Trash2 } from "lucide-react"
import Link from "next/link"

export default async function GroupsPage(){
    const supabase = await createClient()

    const {data: authUser} = await supabase.auth.getUser()

    const {data, error} = await supabase.from("groups").select(`
        id,
        name,
        owner_id,
        created_at,
        participants!inner(email)
    `).eq("participants.email", authUser?.user?.email)

    if(error){
        <p>Erro ao carregar grupos</p>
    }
    return(
        <>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Meus grupos</h1>

                <Separator className="my-4"/>

                <ScrollArea className="h-[calc(100vh-200px)]">
                    {data && data.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <>
                                    {data?.map((group) => (
                                        <Link href={`/app/grupos/${group.id}`} key={group.id} className="cursor-pointer">
                                            <Card className="overflow-hidden flex justify-between items-center">
                                                <div>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle>{group.name}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                            <Calendar className="size-4 mr-2"/>
                                                            {new Date(group.created_at).toLocaleDateString()}
                                                        </div>
                                                    </CardContent>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </>
                        </div>
                    ) : (
                        <p className="mt-2 w-full py-4 flex items-center justify-center font-bold text-[13px] md:text-[20px] rounded-2xl border border-zinc-700/20 bg-amber-600">não existe nenhum grupo no momento, crie um agora!</p>
                    )}
                </ScrollArea>
            </main>
        </>
    )
}