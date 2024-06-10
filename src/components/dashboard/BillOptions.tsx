"use client";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui//dropdown-menu";

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
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

const BillOptions = () => {
    return (
        <div className="absolute right-4 top-2 flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost">Costos ($0)</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when
                            youre done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <Table>
                            <TableCaption>
                                A list of your recent invoices.
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        Invoice
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.invoice}>
                                        <TableCell className="font-medium">
                                            {invoice.invoice}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.paymentStatus}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.paymentMethod}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {invoice.totalAmount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="text-right">
                                        $2,500.00
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 data-[state=open]:bg-muted">
                        <Ellipsis className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end" forceMount>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>Reenviar</DropdownMenuItem>
                        <DropdownMenuItem>Descargar</DropdownMenuItem>
                        <DropdownMenuItem>Compartir</DropdownMenuItem>
                        <DropdownMenuItem>Pagado</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default BillOptions;
