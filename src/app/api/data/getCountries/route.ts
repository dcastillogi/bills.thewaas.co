import clientPromise from "@/lib/mongodb";

export const GET = async () => {
    const client = await clientPromise;
    const db = await client.db("main");
    const geography = await db.collection("geography");
    const countries = await geography.find(
        {},
        {
            projection: {
                name: 1,
                code: 1,
                _id: 0,
            },
        }
    );
    return Response.json(await countries.toArray());
};
