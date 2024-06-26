import { verifyTeam } from "@/lib/actions"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const GET = async() => {
    const {session, userId} = await getSession()
    if (!session.isLoggedIn) return new Response("User not logged in", {status: 401})
    const team = await verifyTeam(userId)
    if (!team) return new Response("Team not found", {status: 404})
    const client = await clientPromise
    const db = client.db("main")
    const plans = await db.collection("plans").find({teamId: new ObjectId(team)}, {
        projection: {
            description: 0
        }
    }).toArray()
    return Response.json(plans)
}