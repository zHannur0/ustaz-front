import Api from "./api.service.ts";
import type {SubjectResponse} from "../types/qmj.types.ts";

export class QMJService {
    public static async getSubjects(): Promise<SubjectResponse> {
        console.log("Asf")
        const {data} = await Api.get("api/v1/subjects/");
        return data;
    }
}