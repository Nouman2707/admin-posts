"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, Plus, List, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Posts", href: "/admin", icon: List, current: pathname === "/admin" },
    { name: "New Post", href: "/admin/posts/new", icon: Plus, current: pathname === "/admin/posts/new" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container-responsive py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-2xl font-bold">Admin Dashboard</h1>

              {/* Desktop Navigation */}
              <nav className="hidden sm:flex gap-2">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    asChild
                    variant={item.current ? "default" : "ghost"}
                    size="sm"
                    className="button-responsive"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="button-responsive">
                <Link href="/">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Public Site</span>
                  <span className="sm:hidden">Site</span>
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="sm:hidden mt-3 pt-3 border-t">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    asChild
                    variant={item.current ? "default" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>
      <main className="container-responsive py-6 sm:py-8">{children}</main>
    </div>
  )
}
