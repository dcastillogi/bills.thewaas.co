"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CURRENCIES, DOCUMENT_TYPES, LANGUAGES } from "@/lib/const";
import { ScrollArea } from "../../ui/scroll-area";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
    name: z.string().min(2),
    docType: z.enum(DOCUMENT_TYPES.map((doc) => doc.id) as any),
    docNumber: z.string().min(5),
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
    state: z.string().min(1),
    country: z.string().min(2),
    address: z.string().min(5),
    zip: z.string().min(5).max(9),
    photo: z
        .any()
        .refine(
            (files) => files.length == 0 || files?.[0]?.size <= 5 * 1024 * 1024,
            {
                message: `La foto no debe pesar más de 5MB.`,
            }
        )
        .optional(),
    lang: z.enum(LANGUAGES.map((lang) => lang.id) as any),
    currency: z.enum(CURRENCIES.map((currency) => currency.id) as any),
});

const ContactForm = ({ teamId }: { teamId: string }) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [countrySelected, setCountrySelected] = useState("");
    const [cities, setCities] = useState([]);
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            docNumber: "",
            email: "",
            phone: "",
            city: "",
            address: "",
            zip: "",
            photo: [],
            lang: "",
            currency: "",
        },
    });
    const { toast } = useToast();

    useEffect(() => {
        fetch("/api/data/getCountries", {
            cache: "no-cache",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setCountries(data);
            })
            .catch((error) => {
                toast({
                    title: "¡Oh no! Algo salió mal",
                    description: "No pudimos cargar los países disponibles",
                });
            });
    }, [toast]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            if (values.photo && values.photo.length > 0) {
                formData.append("photo", values.photo[0]);
            }
            formData.append("data", JSON.stringify(values));
            const response = await fetch("/api/contact/create", {
                method: "POST",
                body: formData,
                credentials: "include",
                headers: {
                    team: teamId,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                toast({
                    title: "¡Listo!",
                    description: "Contacto creado exitosamente",
                });
                setOpen(false);
                form.reset();
            }
        } catch (error: any) {
            if (error.message.includes("400")) {
                toast({
                    title: "¡Oh no! Algo salió mal",
                    description: "El contacto ya existe",
                });
            }
            toast({
                title: "¡Oh no! Algo salió mal",
                description: "No pudimos crear el contacto",
            });
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>Crear</Button>
            </DialogTrigger>
            <DialogContent className="p-0">
                <ScrollArea className="max-h-[calc(100vh-50px)] px-6 py-8">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                console.log(errors);
                            })}
                            className="px-2"
                        >
                            <DialogHeader className="mb-1">
                                <DialogTitle>Crear contacto</DialogTitle>
                                <DialogDescription>
                                    Completa la información para agregar un
                                    nuevo contacto. Haz clic en guardar cuando
                                    hayas terminado.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>País</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(
                                                        value: string
                                                    ) => {
                                                        setStates([]);
                                                        setCountrySelected(
                                                            value
                                                        );
                                                        fetch(
                                                            `/api/data/getStates?country=${value}`
                                                        )
                                                            .then(
                                                                (response) => {
                                                                    if (
                                                                        !response.ok
                                                                    ) {
                                                                        throw new Error(
                                                                            `HTTP error! status: ${response.status}`
                                                                        );
                                                                    }
                                                                    return response.json();
                                                                }
                                                            )
                                                            .then((data) => {
                                                                field.onChange(
                                                                    value
                                                                );
                                                                setStates(data);
                                                            })
                                                            .catch((error) => {
                                                                toast({
                                                                    title: "¡Oh no! Algo salió mal",
                                                                    description:
                                                                        "No pudimos cargar los departamentos disponibles",
                                                                });
                                                            });
                                                    }}
                                                >
                                                    <SelectTrigger id="select-country">
                                                        <SelectValue
                                                            placeholder={
                                                                countries.length >
                                                                0
                                                                    ? "--Seleccionar"
                                                                    : "Cargando..."
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {countries.map(
                                                            (country: any) => (
                                                                <SelectItem
                                                                    value={
                                                                        country.code
                                                                    }
                                                                    key={`country-select-${country.code}`}
                                                                >
                                                                    {
                                                                        country.name
                                                                    }
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
                                <div className="grid sm:grid-cols-6 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="docType"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel>Tipo</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="--Seleccionar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {DOCUMENT_TYPES.filter((doc) => !countrySelected || doc.country == countrySelected).map(
                                                                (type) => (
                                                                    <SelectItem
                                                                        value={
                                                                            type.id
                                                                        }
                                                                        key={`type-select-${type.id}`}
                                                                    >
                                                                        {
                                                                            type.name
                                                                        }
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
                                        name="docNumber"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-4">
                                                <FormLabel>
                                                    Número de Documento
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
                                </div>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nombre Completo
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
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
                                    name="photo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Miniatura (Opcional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    {...field}
                                                    accept="image/png, image/jpeg, image/jpg"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Recomendado 100x100px
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Correo Electrónico
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ejemplo@ejemplo.com"
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
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Celular</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="573002549256"
                                                    {...field}
                                                    autoComplete="off"
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
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="zip"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>
                                                    Código Postal
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="03483"
                                                        {...field}
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Departamento
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(
                                                            value: string
                                                        ) => {
                                                            setCities([]);
                                                            fetch(
                                                                `/api/data/getCities?country=${countrySelected}&state=${value}`
                                                            )
                                                                .then(
                                                                    (
                                                                        response
                                                                    ) => {
                                                                        if (
                                                                            !response.ok
                                                                        ) {
                                                                            throw new Error(
                                                                                `HTTP error! status: ${response.status}`
                                                                            );
                                                                        }
                                                                        return response.json();
                                                                    }
                                                                )
                                                                .then(
                                                                    (data) => {
                                                                        field.onChange(
                                                                            value
                                                                        );
                                                                        setCities(
                                                                            data
                                                                        );
                                                                    }
                                                                )
                                                                .catch(
                                                                    (error) => {
                                                                        toast({
                                                                            title: "¡Oh no! Algo salió mal",
                                                                            description:
                                                                                "No pudimos cargar las ciudades disponibles",
                                                                        });
                                                                    }
                                                                );
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                id="select-state"
                                                                placeholder={
                                                                    states.length >
                                                                    0
                                                                        ? "--Seleccionar"
                                                                        : "Elegir País..."
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {states.map(
                                                                (
                                                                    state: any
                                                                ) => (
                                                                    <SelectItem
                                                                        value={
                                                                            state.code
                                                                        }
                                                                        key={`state-select-${state.code}`}
                                                                    >
                                                                        {
                                                                            state.name
                                                                        }
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
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ciudad</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={
                                                                    cities.length >
                                                                    0
                                                                        ? "--Seleccionar"
                                                                        : "Elegir Departamento"
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {cities.map(
                                                                (city: any) => (
                                                                    <SelectItem
                                                                        value={
                                                                            city.code
                                                                        }
                                                                        key={`cities-option-${city.code}`}
                                                                    >
                                                                        {
                                                                            city.name
                                                                        }
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

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="lang"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lenguaje</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="--Seleccionar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {LANGUAGES.map(
                                                                (lang) => (
                                                                    <SelectItem
                                                                        value={
                                                                            lang.id
                                                                        }
                                                                        key={`lang-select-${lang.id}`}
                                                                    >
                                                                        {
                                                                            lang.name
                                                                        }
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
                                        name="currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Moneda</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="--Seleccionar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CURRENCIES.map(
                                                                (currency) => (
                                                                    <SelectItem
                                                                        value={
                                                                            currency.id
                                                                        }
                                                                        key={`currency-select-${currency.id}`}
                                                                    >
                                                                        {
                                                                            currency.name
                                                                        }
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
                            <DialogFooter className="mt-2">
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting
                                        ? "Guardando..."
                                        : "Guardar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ContactForm;
