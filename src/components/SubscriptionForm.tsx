import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DOCUMENT_TYPES } from "@/lib/const";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";

import {
    Form,
    FormControl,
    FormDescription,
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
    cardNumber: z.string().min(16).max(16),
    expMonth: z.string().min(1).max(2),
    expYear: z.string().min(4).max(4),
    cvc: z.string().min(3).max(4),
});

export default function SubscriptionForm() {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [countrySelected, setCountrySelected] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {};

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                            name="zip"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Código Postal</FormLabel>
                                    <FormControl>
                                        <Input placeholder="03483" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>País</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value: string) => {
                                            setStates([]);
                                            setCountrySelected(value);
                                            fetch(
                                                `/api/data/getStates?country=${value}`
                                            )
                                                .then((response) => {
                                                    if (!response.ok) {
                                                        throw new Error(
                                                            `HTTP error! status: ${response.status}`
                                                        );
                                                    }
                                                    return response.json();
                                                })
                                                .then((data) => {
                                                    field.onChange(value);
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
                                                    countries.length > 0
                                                        ? "--Seleccionar"
                                                        : "Cargando..."
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country: any) => (
                                                <SelectItem
                                                    value={country.code}
                                                    key={`country-select-${country.code}`}
                                                >
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Departamento</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value: string) => {
                                                setCities([]);
                                                fetch(
                                                    `/api/data/getCities?country=${countrySelected}&state=${value}`
                                                )
                                                    .then((response) => {
                                                        if (!response.ok) {
                                                            throw new Error(
                                                                `HTTP error! status: ${response.status}`
                                                            );
                                                        }
                                                        return response.json();
                                                    })
                                                    .then((data) => {
                                                        field.onChange(value);
                                                        setCities(data);
                                                    })
                                                    .catch((error) => {
                                                        toast({
                                                            title: "¡Oh no! Algo salió mal",
                                                            description:
                                                                "No pudimos cargar las ciudades disponibles",
                                                        });
                                                    });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    id="select-state"
                                                    placeholder={
                                                        states.length > 0
                                                            ? "--Seleccionar"
                                                            : "Elegir País..."
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {states.map((state: any) => (
                                                    <SelectItem
                                                        value={state.code}
                                                        key={`state-select-${state.code}`}
                                                    >
                                                        {state.name}
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
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        cities.length > 0
                                                            ? "--Seleccionar"
                                                            : "Elegir Departamento"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cities.map((city: any) => (
                                                    <SelectItem
                                                        value={city.code}
                                                        key={`cities-option-${city.code}`}
                                                    >
                                                        {city.name}
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
                    <div className="grid sm:grid-cols-6 gap-4">
                        <FormField
                            control={form.control}
                            name="docType"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Tipo</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="--Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DOCUMENT_TYPES.filter(
                                                    (doc) =>
                                                        !countrySelected ||
                                                        doc.country ==
                                                            countrySelected
                                                ).map((type) => (
                                                    <SelectItem
                                                        value={type.id}
                                                        key={`type-select-${type.id}`}
                                                    >
                                                        {type.name}
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
                            name="docNumber"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-4">
                                    <FormLabel>Número de Documento</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="100239247"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight mt-4">Información de pago</h2>
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
                    <div className="grid grid-cols-7 md:grid-cols-8 gap-4">
                        <FormField
                            control={form.control}
                            name="expMonth"
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-2">
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="MM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    { length: 12 },
                                                    (_, i) => i + 1
                                                ).map((month: number) => (
                                                    <SelectItem
                                                        value={month.toString()}
                                                        key={`month-select-${month}`}
                                                    >
                                                        {month}
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
                            name="expYear"
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-2">
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
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
                                                ).map((year: number) => (
                                                    <SelectItem
                                                        value={year.toString()}
                                                        key={`year-select-${year}`}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span></span>
                        <FormField
                            control={form.control}
                            name="cvc"
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <FormControl>
                                        <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full mt-5">
                        Suscribirme
                    </Button>
                </div>
            </form>
        </Form>
    );
}
