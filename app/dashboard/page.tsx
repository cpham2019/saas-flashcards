import AllDocs from "@/components/AllDocs"
import { Button } from "@/components/ui/button"
import { FilePlus2 } from "lucide-react"
import Link from "next/link"

function Dashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center m-5">
              <Link href={"/dashboard/upload"}>
                  <Button>
                      <FilePlus2/>
                      <p className="ml-2">Add your document</p>
                  </Button>
              </Link>
      </div>
      <div className="flex-1 drop-shadow-xl">
        <AllDocs />
      </div>
    </div>
  )
}

export default Dashboard