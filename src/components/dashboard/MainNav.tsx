import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  team
}: {
    className: string,
    team: string
}) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
      <Link
        href={`/${team}`}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Balance
      </Link>
      <Link
        href={`/${team}/contacts`}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Contactos
      </Link>
      <Link
        href={`/${team}/settings`}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Configuración
      </Link>
    </nav>
  )
}