"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "./ui/separator";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LockClosedIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
    name: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z
        .string()
        .min(11, {
            message: "El número de celular debe tener 10 dígitos",
        })
        .max(13, {
            message: "El número de celular debe tener 10 dígitos",
        }),
    city: z.string().min(1),
    address: z.string().min(5),
    cardNumber: z.string().min(16).max(16),
    expMonth: z.string().min(1).max(2),
    expYear: z.string().min(4).max(4),
    cvc: z.string().min(3).max(4),
});

export default function SubscriptionForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { toast } = useToast();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {};

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="mb-5 p-3">
                    <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <p className="text-sm font-medium leading-none">
                                    Sofia Davis
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    m@example.com
                                </p>
                            </div>
                        </div>
                        <Button variant="outline">Usar</Button>
                    </div>
                </Card>
                <div className="flex flex-col gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre (s)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido (s)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ejemplo@ejemplo.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Celular</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="573002549256"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid md:grid-cols-6 gap-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-4">
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="CL 27 #27-51 APTO 301"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="03483" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator className="mt-4 mb-1" />
                    <h2 className="text-2xl font-semibold tracking-tight mb-2">
                        Información de pago
                    </h2>
                    <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Tarjeta</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="4111 1111 1111 1111"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <FormLabel>Fecha de expiración</FormLabel>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <FormField
                                    control={form.control}
                                    name="expMonth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="MM" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from(
                                                            { length: 12 },
                                                            (_, i) => i + 1
                                                        ).map(
                                                            (month: number) => (
                                                                <SelectItem
                                                                    value={month.toString()}
                                                                    key={`month-select-${month}`}
                                                                >
                                                                    {month}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="expYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="YYYY" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from(
                                                            { length: 7 },
                                                            (_, i) =>
                                                                i +
                                                                new Date().getFullYear()
                                                        ).map(
                                                            (year: number) => (
                                                                <SelectItem
                                                                    value={year.toString()}
                                                                    key={`year-select-${year}`}
                                                                >
                                                                    {year}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="cvc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator className="mt-3 mb-2" />
                    <HCaptcha sitekey="d94e78ec-a5ee-4204-adca-376cfa3ac354" />
                    <Button type="submit" className="w-full mt-1">
                        Suscribirme ($7 USD/mes)
                    </Button>
                    <div className="flex justify-center gap-2 -mt-2 items-center">
                        <LockClosedIcon className="w-4 h-4 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm font-medium">
                            Pagos procesados por ePayCo
                        </p>
                    </div>
                </div>
            </form>
        </Form>
    );
}
