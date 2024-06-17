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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
];

const formSchema = z.object({
    concept: z.string().min(2),
    id: z.string().min(2),
    amount: z.string().min(1),
    invoice: z
        .any()
        .refine(
            (value) => {
                if (value && value.length > 0) {
                    return value[0].size < 1024 * 1024 * 5;
                }
                return true;
            },
            {
                message: "El archivo no puede ser mayor a 5MB",
            }
        )
        .optional(),
});

const BillOptions = ({ billId }: { billId: string }) => {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            concept: "",
            id: "",
            amount: "",
            invoice: [],
        },
    });
    const { toast } = useToast();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            if (values.invoice && values.invoice.length > 0) {
                formData.append("invoice", values.invoice[0]);
            }
            formData.append("data", JSON.stringify(values));
            const response = await fetch("/api/bill/cost/create", {
                method: "POST",
                body: formData,
                credentials: "include",
                headers: {
                    bill: billId,
                },
            });
            if (!response.ok) {
                toast({
                    title: "¡Oh no! Algo salió mal",
                    description: "No pudimos crear el contacto",
                });
            } else {
                toast({
                    title: "¡Listo!",
                    description: "Factura cargada exitosamente",
                });
                setOpen(false);
                form.reset();
            }
        } catch (error: any) {
            toast({
                title: "¡Oh no! Algo salió mal",
                description: "No pudimos crear el contacto",
            });
        }
    };
    return (
        <div className="absolute right-4 top-2 flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost">Costos ($0)</Button>
                </SheetTrigger>
                <SheetContent className=" w-[500px] max-w-[90vw] md:max-w-max">
                    <SheetHeader>
                        <SheetTitle>Facturas</SheetTitle>
                        <SheetDescription>
                            Facturas asociadas a la costos de la cuenta de cobro
                            original.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <Table>
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
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setOpen(true)}>
                                    Añadir
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(
                                            onSubmit,
                                            (errors) => {
                                                console.log(errors);
                                            }
                                        )}
                                        className="px-2"
                                    >
                                        <DialogHeader>
                                            <DialogTitle>
                                                Agregar Factura
                                            </DialogTitle>
                                            <DialogDescription>
                                                Añade una nueva factura
                                                relacionada con costos a la
                                                cuenta de cobro original.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <FormField
                                                control={form.control}
                                                name="id"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-4">
                                                        <FormLabel>
                                                            No. Factura
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="100239247"
                                                                {...field}
                                                                autoComplete="off"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="concept"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-4">
                                                        <FormLabel>
                                                            Concepto
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Factura Google Ads"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="amount"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-4">
                                                        <FormLabel>
                                                            Cantidad
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="150000"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="invoice"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Factura
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="file"
                                                                {...field}
                                                                accept="application/pdf, .zip, .rar, .7zip"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <DialogFooter className="flex w-full justify-between">
                                            <Button
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                            >
                                                {form.formState.isSubmitting
                                                    ? "Guardando..."
                                                    : "Guardar"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-10 w-10 p-0 data-[state=open]:bg-muted"
                    >
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
                        <DropdownMenuItem className="text-destructive">
                            Reversar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default BillOptions;
