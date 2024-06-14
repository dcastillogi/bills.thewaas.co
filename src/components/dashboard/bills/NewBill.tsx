"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import ContactSelector from "../contacts/ContactSelector";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { CURRENCIES, LANGUAGES } from "@/lib/const";

import { usePathname } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../../ui/textarea";
import BillAnnotations from "./BillAnnotations";

import { useToast } from "@/components/ui/use-toast";

const productSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string().optional(),
    price: z.string(),
    quantity: z.string().min(1),
    annotations: z.array(
        z.object({
            text: z.string().min(1),
        })
    ),
});

const formSchema = z.object({
    contact: z.string().min(2),
    lang: z.enum(LANGUAGES.map((lang) => lang.id) as any),
    currency: z.enum(CURRENCIES.map((currency) => currency.id) as any),
    product: z.array(productSchema).min(1, {
        message: "Debes agregar al menos un producto",
    }),
    includePaymentLink: z.boolean(),
    email: z
        .string()
        .min(1, { message: "Este campo es obligatorio." })
        .email("Correo electrónico inválido."),
    createdAt: z.string(),
    expiresAt: z.string(),
    payments: z.array(
        z.object({
            amount: z.string().min(1),
            date: z.string(),
        })
    ),
    annotations: z.array(
        z.object({
            text: z.string().min(1),
        })
    ),
});

const NewBill = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: [
                {
                    annotations: [],
                },
            ],
            includePaymentLink: false,
            annotations: [],
            payments: [],
        },
    });

    const { toast } = useToast();

    const {
        fields: productFields,
        append: appendProduct,
        remove: removeProduct,
    } = useFieldArray({
        name: "product",
        control: form.control,
    });

    const {
        fields: paymentFields,
        append: appendPayment,
        remove: removePayment,
    } = useFieldArray({
        control: form.control,
        name: "payments",
    });

    const {
        fields: annotationFields,
        append: appendAnnotation,
        remove: removeAnnotation,
    } = useFieldArray({
        control: form.control,
        name: "annotations",
    });

    const pathname = usePathname();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch("/api/bill/create", {
            method: "POST",
            body: JSON.stringify({
                ...values,
                expiresAt: new Date(new Date(values.expiresAt + "T23:59:59Z").getTime() + new Date().getTimezoneOffset() * 60000).toISOString(),
                createdAt: new Date(new Date(values.createdAt + "T00:00:00Z").getTime() + new Date().getTimezoneOffset() * 60000).toISOString(),
            }),            
            headers: {
                team: pathname.split("/")[1],
            },
        });
        if (response.ok) {
            const data = await response.json();
            toast({
                title: "Cuenta de cobro creada",
                description: `La cuenta de cobro No. ${data.bill} ha sido creada.`,
            });
        } else {
            toast({
                title: "Oh oh! Algo salió mal",
                description: "Hubo un error creando la cuenta de cobro",
            });
        }
    };

    const changeLang = (lang: any) => {
        form.setValue("lang", lang);
    };
    const changeCurrency = (currency: any) => {
        form.setValue("currency", currency);
    };
    const changeEmail = (email: any) => {
        form.setValue("email", email);
    };

    return (
        <Form {...form}>
            <form
                className="max-w-2xl min-w-[600px] mx-auto px-8 py-10 relative space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div>
                    <h3 className="text-xl font-semibold">Cuenta de Cobro</h3>
                    <p className="text-sm text-muted-foreground">
                        This is how others will see you on the site.
                    </p>
                </div>
                <Separator className="mb-2" />
                <div className="space-y-2 pb-2">
                    <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Información Cliente</FormLabel>
                                <FormControl>
                                    <div className="flex gap-4">
                                        <ContactSelector
                                            className="flex-grow"
                                            onChangeValue={field.onChange}
                                            changeLang={changeLang}
                                            changeCurrency={changeCurrency}
                                            changeEmail={changeEmail}
                                        />
                                        <Button
                                            variant="secondary"
                                            type="button"
                                        >
                                            Nuevo
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="lang"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lenguaje</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="--Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LANGUAGES.map((lang) => (
                                                    <SelectItem
                                                        value={lang.id}
                                                        key={`lang-select-${lang.id}`}
                                                    >
                                                        {lang.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Moneda</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="--Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CURRENCIES.map((currency) => (
                                                    <SelectItem
                                                        value={currency.id}
                                                        key={`currency-select-${currency.id}`}
                                                    >
                                                        {currency.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="createdAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha del Documento</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            type="date"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expiresAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Expiración</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            type="date"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Separator />
                <div className="space-y-6">
                    {productFields.map((field, index) => (
                        <div
                            className="grid grid-cols-5 gap-4 border p-4 pb-5 rounded"
                            key={`product-${index}-title`}
                        >
                            <div className="col-span-3 space-y-2">
                                <FormField
                                    control={form.control}
                                    name={`product.${index}.title`}
                                    key={`${field.id}.title`}
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
                                    key={`${field.id}.description`}
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
                            </div>
                            <div className="col-span-2 space-y-2">
                                <FormField
                                    control={form.control}
                                    name={`product.${index}.price`}
                                    key={`${field.id}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Precio Unitario
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
                                    key={`${field.id}.quantity`}
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

                            <BillAnnotations
                                form={form}
                                nestedIndex={field.id}
                            />
                        </div>
                    ))}
                    <Button
                        className="w-full"
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            appendProduct({
                                title: "",
                                price: "",
                                quantity: "",
                                annotations: [],
                                description: "",
                            })
                        }
                    >
                        Agregar Producto ({productFields.length})
                    </Button>
                </div>
                <Separator />
                <div>
                    <div className="space-y-4 w-full col-span-5">
                        {annotationFields.map((annotation, index) => (
                            <FormField
                                control={form.control}
                                name={`annotations.${index}.text`}
                                key={annotation.id}
                                render={({ field: annotation }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Anotación No. {index + 1}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Escribe tu anotación aquí..."
                                                {...annotation}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            className="w-full"
                            type="button"
                            variant="outline"
                            onClick={() => appendAnnotation({ text: "" })}
                        >
                            Agregar Anotación ({annotationFields.length})
                        </Button>
                    </div>
                </div>
                <Separator />
                <div>
                    <div className="space-y-4 w-full col-span-5">
                        {paymentFields.map((payment, index) => (
                            <div
                                className="grid grid-cols-3 gap-4"
                                key={`payment-${payment.id}`}
                            >
                                <FormField
                                    control={form.control}
                                    name={`payments.${index}.date`}
                                    key={payment.id}
                                    render={({ field: payment }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Fecha No. {index + 1}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    placeholder="Fecha"
                                                    {...payment}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`payments.${index}.amount`}
                                    key={payment.id}
                                    render={({ field: payment }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>
                                                Cantidad No. {index + 1}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="$120.000"
                                                    {...payment}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                        <Button
                            className="w-full"
                            type="button"
                            variant="outline"
                            onClick={() =>
                                appendPayment({
                                    amount: "",
                                    date: "",
                                })
                            }
                        >
                            Agregar Cuota de Pago ({paymentFields.length})
                        </Button>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Correo electrónico de notificación
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ejemplo@ejemplo.com"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center space-x-2">
                        <Switch id="payment-link" />
                        <Label htmlFor="payment-link" className="font-normal">
                            Incluir Link de Pago
                        </Label>
                    </div>
                </div>
                <Button className="w-full">
                    {form.formState.isSubmitting
                        ? "Creando cuenta de cobro..."
                        : "Crear cuenta de cobro"}
                </Button>
            </form>
        </Form>
    );
};

export default NewBill;
