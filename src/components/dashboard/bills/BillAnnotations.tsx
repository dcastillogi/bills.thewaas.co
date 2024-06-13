import { Button } from "@/components/ui/button";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const BillAnnotations = ({
    form,
    nestedIndex,
}: {
    form: any;
    nestedIndex: string;
}) => {
    const {
        fields: annotationFields,
        append: appendAnnotation,
        remove: removeAnnotation,
    } = useFieldArray({
        control: form.control,
        name: `product.${nestedIndex}.annotations`,
    });
    return (
        <div className="space-y-4 w-full col-span-5">
            {annotationFields.map((annotation, index) => (
                <FormField
                    control={form.control}
                    name={`product.${nestedIndex}.annotations.${index}.text`}
                    key={annotation.id}
                    render={({ field: annotation }) => (
                        <FormItem>
                            <FormLabel>Anotación No. {index + 1}</FormLabel>
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
                onClick={() => appendAnnotation("")}
            >
                Agregar Anotación ({annotationFields.length})
            </Button>
        </div>
    );
};

export default BillAnnotations;
