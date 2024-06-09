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
import { LucideContact } from "lucide-react";

const contacts = [
    {
        label: "Acme Inc.",
        value: "acme-inc",
    },
    {
        label: "Monsters Inc.",
        value: "monsters",
    },
];

type Contact = (typeof contacts)[number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function ContactSelector({ className }: TeamSwitcherProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedContact, setSelectedContact] =
        React.useState<Contact | null>(null);

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
                                <AvatarImage
                                    src={`https://avatar.vercel.sh/${selectedContact.value}.png`}
                                    alt={selectedContact.label}
                                    className="grayscale"
                                />
                                <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                            {selectedContact.label}
                        </>
                    )}
                    <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 PopoverContent">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search team..." />
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup></CommandGroup>
                        {contacts.map((contact) => (
                            <CommandItem
                                key={contact.value}
                                onSelect={() => {
                                    setSelectedContact(contact);
                                    setOpen(false);
                                }}
                                className="text-sm"
                            >
                                <Avatar className="mr-2 h-5 w-5">
                                    <AvatarImage
                                        src={`https://avatar.vercel.sh/${contact.value}.png`}
                                        alt={contact.label}
                                        className="grayscale"
                                    />
                                    <AvatarFallback>SC</AvatarFallback>
                                </Avatar>
                                {contact.label}
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
