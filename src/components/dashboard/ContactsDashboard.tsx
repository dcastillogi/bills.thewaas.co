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

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

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

const ContactsDashboard = () => {
    return (
        <div className="max-w-5xl px-4 mx-auto mt-6">
            <div className="py-3 flex items-center justify-between overflow-x-auto px-2.5 mb-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Contactos
                    </h2>
                    <p className="text-muted-foreground">
                        Here&apos;s a list of your tasks for this month!
                    </p>
                </div>
                <div className="flex items-center justify-end space-x-2 min-w-[600px]">
                    <Button>Crear</Button>
                </div>
            </div>
            <div className="max-w-8xl mx-auto w-full min-h-[calc(100vh-240px)] lg:flex pb-12">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Celular</TableHead>
                            <TableHead>Correo Electrónico</TableHead>
                            <TableHead>Ciudad</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell>
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src="/avatars/01.png" />
                                            <AvatarFallback>OM</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                Sofia Davis
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                m@example.com
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell>
                                    {invoice.totalAmount}
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
