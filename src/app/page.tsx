'use client'
import { Button } from "@/components/ui/button";
import Login from "./(auth)/login/page";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter()
  useEffect(() => {
    route.push('/login')
  }, [])

  return (
    <>
    </>
  );
}
