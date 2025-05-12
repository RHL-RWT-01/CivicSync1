"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { BarChart2, LogOut, Map, Menu, Plus, User } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      href: "/issues",
      label: "Public Issues",
      active: pathname === "/issues",
    },
    {
      href: "/map",
      label: "Map View",
      active: pathname === "/map",
    },
    {
      href: "/analytics",
      label: "Analytics",
      active: pathname === "/analytics",
    },
  ]

  const authRoutes = [
    {
      href: "/issues/new",
      label: "Report Issue",
      active: pathname === "/issues/new",
      icon: <Plus className="mr-2 h-4 w-4" />,
    },
    {
      href: "/my-issues",
      label: "My Issues",
      active: pathname === "/my-issues",
      icon: <User className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">CivicSync</span>
        </Link>
        <div className="hidden md:flex items-center justify-between flex-1">
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  route.active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                {authRoutes.map((route) => (
                  <Link key={route.href} href={route.href}>
                    <Button
                      variant={route.href === "/issues/new" ? "default" : "outline"}
                      size="sm"
                      className="hidden lg:flex"
                    >
                      {route.icon}
                      {route.label}
                    </Button>
                  </Link>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <span className="sr-only">Open user menu</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <span className="text-xs font-medium">{user.email?.charAt(0).toUpperCase() || "U"}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-issues" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> My Issues
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/analytics" className="cursor-pointer">
                        <BarChart2 className="mr-2 h-4 w-4" /> Analytics
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/map" className="cursor-pointer">
                        <Map className="mr-2 h-4 w-4" /> Map View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="md:hidden flex items-center ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      route.active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                <div className="py-2">
                  <ThemeToggle />
                </div>
                {user ? (
                  <>
                    <div className="border-t pt-4 mt-4">
                      {authRoutes.map((route) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center py-2 text-sm font-medium transition-colors hover:text-primary"
                        >
                          {route.icon}
                          {route.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}
                        className="flex items-center py-2 text-sm font-medium text-red-500 transition-colors hover:text-red-600 w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsOpen(false)} className="block">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
