"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
    className,
    team,
}: {
    className: string;
    team: string;
}) {
    const pathname = usePathname();

    return (
        <nav
            className={cn(
                "flex items-center space-x-4 lg:space-x-6",
                className
            )}
        >
            <Link
                href={`/${team}`}
                className={cn({
                    "text-sm font-medium text-muted-foreground transition-colors hover:text-primary":
                        true,
                    "text-primary": pathname === `/${team}`,
                })}
            >
                Cuentas de Cobro
            </Link>
            <Link
                href={`/${team}/contacts`}
                className={cn({
                    "text-sm font-medium text-muted-foreground transition-colors hover:text-primary":
                        true,
                    "text-primary": pathname.includes("contacts"),
                })}
            >
                Contactos
            </Link>
            <Link
                href={`/${team}/settings`}
                className={cn({
                    "text-sm font-medium text-muted-foreground transition-colors hover:text-primary":
                        true,
                    "text-primary": pathname.includes("settings"),
                })}
            >
                Configuración
            </Link>
        </nav>
    );
}
