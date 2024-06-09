"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import ContactSelector from "./ContactSelector";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../ui/textarea";

const productSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string().optional(),
    price: z.number(),
    quantity: z.number().min(1),
    annotations: z.array(z.string()).optional(),
});

const formSchema = z.object({
    contact: z.string().min(2),
    product: z.array(productSchema).min(1, {
        message: "Debes agregar al menos un producto",
    }),
    includePaymentLink: z.boolean(),
});

const NewBill = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: [{}],
            includePaymentLink: false
        },
    });
    const { fields, append, remove } = useFieldArray({
        name: "product",
        control: form.control,
        rules: { minLength: 1 },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    };

    return (
        <Form {...form}>
            <form
                className="max-w-2xl min-w-[600px] mx-auto px-8 py-10 relative space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div>
                    <h3 className="text-xl font-semibold">
                        Nueva Cuenta de Cobro
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        This is how others will see you on the site.
                    </p>
                </div>
                <Separator className="mb-2" />
                <div className="space-y-1 pb-2">
                    <Label>Información Cliente</Label>
                    <div className="flex gap-4">
                        <ContactSelector className="flex-grow" />
                        <Button variant="secondary">Nuevo</Button>
                    </div>
                </div>
                <Separator />
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div
                            className="grid grid-cols-5 gap-4 border p-4 pb-5 rounded"
                            key={`product-${index}-title`}
                        >
                            <div className="col-span-3 space-y-2">
                                <FormField
                                    control={form.control}
                                    name={`product.${index}.title`}
                                    key={field.id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Título Producto
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`product.${index}.description`}
                                    key={field.id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Descripción Producto
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="button" variant="outline">
                                    Agregar Anotación
                                </Button>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <FormField
                                    control={form.control}
                                    name={`product.${index}.price`}
                                    key={field.id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Precio Unitario (COP)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`product.${index}.quantity`}
                                    key={field.id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cantidad</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="1"
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <p>
                                    <strong>Total:</strong> $20.000
                                </p>
                            </div>
                        </div>
                    ))}
                    <Button
                        className="w-full"
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            append({
                                title: "",
                                price: 0,
                                quantity: 0,
                            })
                        }
                    >
                        Agregar Producto ({fields.length})
                    </Button>
                </div>
                <Separator />
                <div>
                    <div className="flex items-center space-x-2">
                        <Switch id="payment-link" />
                        <Label htmlFor="payment-link" className="font-normal">
                            Incluir Link de Pago
                        </Label>
                    </div>
                </div>
                <Button
                    className="w-full"
                >
                    Crear
                </Button>
            </form>
        </Form>
    );
};

export default NewBill;
