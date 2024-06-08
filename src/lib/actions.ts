"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "./session";

export async function logout() {
    // false => no db call for logout
    const {session} = await getSession(false);
    session.destroy();
    revalidatePath("/");
}
