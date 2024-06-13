"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { usePathname } from "next/navigation";

export default function ContactSelector({ className, onChangeValue, changeLang, changeCurrency }: { className?: string, onChangeValue: (value: string) => void, changeLang: (lang: string) => void, changeCurrency: (currency: string) => void}) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [selectedContact, setSelectedContact] = React.useState<any>(null);
    const [contacts, setContacts] = React.useState<any[]>([]);
    const pathname = usePathname();

    React.useEffect(() => {
        const team = pathname.split("/")[1];

        fetch(`/api/contacts/get?team=${team}`)
            .then((res) => res.json())
            .then((data) => {
                setContacts(data);
                setLoading(false);
            });
    }, [pathname]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a team"
                    className={cn("justify-between", className)}
                >
                    {selectedContact !== null && (
                        <>
                            <Avatar className="mr-2 h-5 w-5">
                                {selectedContact.blobUrl && (
                                    <AvatarImage
                                        src={selectedContact.blobUrl}
                                        alt={selectedContact.name}
                                        className="grayscale"
                                    />
                                )}

                                <AvatarFallback>
                                    {selectedContact.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            {selectedContact.name}
                        </>
                    )}
                    <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 PopoverContent">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Buscar contacto..." />
                        <CommandEmpty>{loading ? "Cargando Contactos..." : "No se encontraron contactos."}</CommandEmpty>
                        <CommandGroup></CommandGroup>
                        {contacts.map((contact) => (
                            <CommandItem
                                key={contact._id}
                                onSelect={() => {
                                    setSelectedContact(contact);
                                    setOpen(false);
                                    onChangeValue(contact._id);
                                    changeCurrency(contact.currency);
                                    changeLang(contact.lang);
                                }}
                                className="text-sm"
                            >
                                <Avatar className="mr-2 h-5 w-5">
                                    {
                                        contact.blobUrl && (
                                            <AvatarImage
                                                src={contact.blobUrl}
                                                alt={contact.name}
                                                className="grayscale"
                                            />
                                        )
                                    }
                                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                </Avatar>
                                {contact.name}  
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        selectedContact &&
                                            selectedContact.value ===
                                                contact.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
