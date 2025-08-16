'use server'
import { register } from "@/apis/auth.api";

export async function registerAction(payload: RegisterType) {
    try {
        const data = await register(payload);
        return { success: true, data };
    } catch (err: any) {
        return {
            success: false,
            data: err.response.data
        };
    }
}

export async function loginAction(data: { email: string, password: string }) {
}
