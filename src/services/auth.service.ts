import Api from "./api.service.ts";

export class AuthService {
    public static async requestOtp(payload) {
        const {data} = await Api.post("api/auth/request-otp/", {email: payload});
        return data;
    }

    public static async verifyOtp(email: string, code: string ) {
        await Api.post("api/auth/verify-otp/", {email, code});
    }

}