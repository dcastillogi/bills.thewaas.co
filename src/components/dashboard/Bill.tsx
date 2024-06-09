const Bill = () => {
    return (
        <div className="w-[800px] mx-auto px-8 py-10 relative">
            <h1 className="text-2xl font-bold">Cuenta de Cobro</h1>
            <table className="text-sm mt-10">
                <tbody>
                    <tr>
                        <td className="font-bold pr-4">
                            Número de Cuenta de Cobro
                        </td>
                        <td className="font-medium">
                            clx5numem000008l0hqys2181
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold pr-4">Fecha de Expedición</td>
                        <td>Mayo 28, 2024</td>
                    </tr>
                    <tr>
                        <td className="font-bold pr-4">Fecha de Vencimiento</td>
                        <td>Mayo 29, 2024</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex gap-32 mt-8">
                <table className="text-sm grow-0 block">
                    <tbody>
                        <tr>
                            <td className="font-bold">Vercel Inc.</td>
                        </tr>
                        <tr>
                            <td>440 N Barranca Ave #4133</td>
                        </tr>
                        <tr>
                            <td>Covina, California 91723</td>
                        </tr>
                        <tr>
                            <td>United States</td>
                        </tr>
                        <tr>
                            <td>ar@vercel.com</td>
                        </tr>
                    </tbody>
                </table>
                <table className="text-sm">
                    <tbody>
                        <tr>
                            <td className="font-bold">Cuenta de cobro para</td>
                        </tr>
                        <tr>
                            <td>Daniel Castillo Giraldo</td>
                        </tr>
                        <tr>
                            <td>CRA 20 57-35</td>
                        </tr>
                        <tr>
                            <td>Manizales, Caldas 91723</td>
                        </tr>
                        <tr>
                            <td>Colombia</td>
                        </tr>
                        <tr>
                            <td>daniel.castillo@storend.com.co</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="mt-10 text-xl font-semibold">
                $120.000 COP antes de Mayo 29, 2024
            </p>
            <a
                href="https://"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500 dark:text-blue-300 mt-2 block font-bold"
            >
                Pagar online
            </a>
            <table className="w-full text-left mt-12">
                <tbody>
                    <tr className="text-xs border-b border-primary">
                        <th className="font-normal pb-2">Descripción</th>
                        <th className="font-normal pb-2">Cant.</th>
                        <th className="font-normal pb-2">Precio Unitario</th>
                        <th className="font-normal pb-2">Total</th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Bill;
