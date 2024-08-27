import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"

function Header() {
  return (
    <div className="flex  items-center justify-between p-4 border-b drop-shadow-2xl">
        <Link href={"/dashboard"}>
            <p className="font-bold text">Flash</p>
        </Link>
        <div className="flex items-center justify-center">
            <Link href={"/dashboard/upgrade"}><Button variant={"outline"} className="mr-4">Upgrade</Button></Link>
            <UserButton/>
        </div>
    </div>
  )
}

export default Header