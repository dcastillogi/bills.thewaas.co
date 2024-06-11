import clientPromise from "@/lib/mongodb";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    if (!searchParams.has("country") || !searchParams.get("state"))
        return Response.json(
            {
                message: "Some fields are missing in the request",
            },
            {
                status: 400,
            }
        );
    const client = await clientPromise;
    const db = await client.db("main");
    const geography = await db.collection("geography");
    const countries = await geography.aggregate([
        {
            $match: { code: searchParams.get("country") },
        },
        {
            $unwind: "$states",
        },
        {
            $replaceRoot: { newRoot: "$states" },
        },
        {
            $match: { code: searchParams.get("state") },
        },
        {
            $unwind: "$cities",
        },
        {
            $replaceRoot: { newRoot: "$cities" },
        }
    ]);
    return Response.json(await countries.toArray());
};
