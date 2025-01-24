'use client'
import { useToast } from "@/hooks/use-toast";
import { Logout } from "./actions";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function LogoutPage(){
    const toast = useToast()
    const router = useRouter()

    const handleLogout = async () => {
        const { success, message, redirectTo } = await Logout();

        if (success) {
            toast.toast({
                title: "Sucesso",
                description: message,
            })
            if (redirectTo) {
                setTimeout(() => {
                    router.push(redirectTo)
                }, 1000)
            }
        } else {
            toast.toast({
                title: "Erro",
                description: message,
                variant: "destructive"
            })
        }
    }
    return(
        <>
            <Button onClick={() => handleLogout()} variant={'link'} className="max-md:w-full h-full p-0 text-foreground text-sm flex justify-start items-center gap-2 text-red-400 underline underline-offset-1">
                <LogOutIcon className="size-4" />
                Logout
            </Button>
        </>
    )
}