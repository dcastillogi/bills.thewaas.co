import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { email, password } = await request.json<any>()
    return Response.json({ email, password })
}
