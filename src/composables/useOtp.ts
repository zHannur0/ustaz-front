import {ref} from "vue";

export function useOtp() {
    const isOtpSent = ref(false)

    async function requestOtp(email: string): Promise<boolean> {
        try {
            // Call backend API
            await fetch('/api/send-otp', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: { 'Content-Type': 'application/json' },
            })
            isOtpSent.value = true
            return true
        } catch (e) {
            console.error('OTP send error:', e)
            return false
        }
    }

    async function verifyOtp(email: string, code: string): Promise<boolean> {
        try {
            const res = await fetch('/api/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ email, code }),
                headers: { 'Content-Type': 'application/json' },
            })
            return res.ok
        } catch (e) {
            console.error('OTP verify error:', e)
            return false
        }
    }

    return { requestOtp, verifyOtp, isOtpSent }
}
