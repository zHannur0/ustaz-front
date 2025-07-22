import Api from "./api.service.ts";


export class AuthService {
    public static async requestOtp(payload) {
        const {data} = await Api.post("api/auth/request-otp/", payload);
        return data;
    }

    public static async verifyOtp(payload) {
        await Api.post("api/auth/verify-otp/", payload);
    }
}