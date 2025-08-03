import {ref} from "vue";
import {AuthService} from "../services/auth.service.ts";

export function useOtp() {
    const isOtpSent = ref(false)

    async function requestOtp(email: string): Promise<boolean> {
        try {
            const otp = await AuthService.requestOtp(email);
            if (otp) return true
        } catch (e) {
            console.error('OTP send error:', e)
            return false
        }
    }

    async function verifyOtp(email: string, code: string): Promise<boolean> {
        try {
            await AuthService.verifyOtp(email, code);
            return res.ok
        } catch (e) {
            console.error('OTP verify error:', e)
            return false
        }
    }

    return { requestOtp, verifyOtp, isOtpSent }
}
