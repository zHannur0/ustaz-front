import { defineStore } from "pinia";
import {QMJService} from "../services/qmj.service.ts";
import type {Subject, SubjectResponse} from "../types/qmj.types.ts";

export const useQmjStore = defineStore("qmj", {
    state: () => ({
        subjects: [] as Subject[],
        isLoading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchSubjects() {
            this.isLoading = true;
            this.error = null;
            try {
                const res = await QMJService.getSubjects();
                this.subjects = res.results;
            } catch (e) {
                this.error = "Не удалось загрузить предметы";
            } finally {
                this.isLoading = false;
            }
        },
    },
});
