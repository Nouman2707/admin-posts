"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SearchInput } from "./search-input"
import { Search } from "lucide-react"

interface MobileSearchProps {
  className?: string
}

export function MobileSearch({ className = "" }: MobileSearchProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`${className} h-9 w-9 p-0`}>
          <Search className="h-4 w-4" />
          <span className="sr-only">Search posts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Search Posts</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SearchInput placeholder="Search posts..." className="w-full" />
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Search by title or content to find specific posts
        </div>
      </DialogContent>
    </Dialog>
  )
}
