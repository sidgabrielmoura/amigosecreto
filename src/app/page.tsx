import { Button } from "@/components/ui/button";
import Login from "./(auth)/login/page";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <Button><Link href={'/login'}>ir para login</Link></Button>
      </div>
    </>
  );
}
