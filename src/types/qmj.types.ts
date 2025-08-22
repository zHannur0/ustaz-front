

interface SubjectGetPayload {
    search?: string;
    ordering?: string;
    page?: number;
}

export interface Subject {
    id: number;
    name: string;
    img: string;
    image_url: string;
    image_name: string;
    qmj_count: number;
    user_count: number;
}

export interface SubjectResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Subject[];
}


interface IQMJ{

}