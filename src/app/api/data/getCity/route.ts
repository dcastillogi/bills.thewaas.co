import { getCityInfo } from "@/lib/actions";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    if (!searchParams.has("city") || !searchParams.has("state") || !searchParams.has("country")) {
        return Response.json(
            {
                message: "City name is required",
            },
            {
                status: 400,
            }
        );
    }
    const city = await getCityInfo(searchParams.get("country")!, searchParams.get("state")!, searchParams.get("city")!);
    return Response.json(city);
};
