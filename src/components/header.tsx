import { Gift, Menu, Plus, UsersRound } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { DropdownMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "./ui/dropdown-menu";

export default function Header() {
    return (
        <>
            <header className="border-b">
                <div className="container mx-auto p-4 flex justify-between">
                    <Link href={'/'} className="flex gap-1 items-center">
                        <Gift className="text-amber-600" />
                        <h1 className="font-light text-[20px]"><span className="font-bold">Amigo</span>Secreto</h1>
                    </Link>

                    <nav className="flex items-center gap-4 max-md:hidden">
                        <Link href={'/app/grupos'} className="text-foreground text-sm flex items-center gap-2">
                            <UsersRound className="size-4" />
                            Meus grupos
                        </Link>

                        <Button variant={"outline"}>
                            <Link href={"/app/grupos/novo"}>
                                Novo grupo
                            </Link>
                            <Plus className="size-4" />
                        </Button>
                    </nav>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center md:hidden mt-1">
                                <Menu />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mr-2">
                            <DropdownMenuLabel>Paginas</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Link href={'/app/grupos'} className="text-foreground text-sm flex items-center gap-2">
                                        <UsersRound className="size-4" />
                                        Meus grupos
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/app/grupos/novo"} className="text-foreground text-sm flex items-center gap-2 border-t-2 w-full justify-center pt-2">
                                        Novo grupo
                                        <Plus className="size-4" />
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </>
    )
}