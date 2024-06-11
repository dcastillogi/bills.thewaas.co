import clientPromise from "@/lib/mongodb";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    if (!searchParams.has("country"))
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
            $project: { cities: 0 },
        }
    ]);
    return Response.json(await countries.toArray());
};
