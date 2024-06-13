import { Ellipsis } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ContactForm from "./contacts/ContactForm";

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "3183911339",
        totalAmount: "Bogotá, Colombia",
        paymentMethod: "dcastillogi@proton.me",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
];

const ContactsDashboard = ({
    contacts,
    teamId,
}: {
    contacts: any[];
    teamId: string;
}) => {
    return (
        <div>
            <div className="py-8 overflow-x-auto mb-4 bg-muted/40 border-b">
                <div className="max-w-5xl px-8 mx-auto flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Contactos
                        </h2>
                    </div>
                    <div className="flex items-center justify-end space-x-2 min-w-[600px]">
                        <ContactForm teamId={teamId} />
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto w-full px-4 min-h-[calc(100vh-240px)] lg:flex pb-12">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">
                                Información
                            </TableHead>
                            <TableHead>Celular</TableHead>
                            <TableHead>Correo Electrónico</TableHead>
                            <TableHead>Ciudad</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact._id}>
                                <TableCell>
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            {contact.photoblobUrl ? (
                                                <AvatarImage
                                                    src={contact.photoblobUrl}
                                                />
                                            ) : null}
                                            <AvatarFallback>
                                                {contact.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-nowrap">
                                            <p className="text-sm font-medium leading-none">
                                                {contact.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {contact.docType == "NIT"
                                                    ? "Persona Jurídica"
                                                    : "Persona Natural"}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>
                                    {contact.city.city +
                                        ", " +
                                        contact.city.country}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 data-[state=open]:bg-muted"
                                            >
                                                <Ellipsis className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-[160px]"
                                        >
                                            <DropdownMenuItem>
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Favorito
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ContactsDashboard;
