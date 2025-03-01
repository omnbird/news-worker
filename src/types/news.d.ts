export interface MediaStackNews {
    title: string;
    description: string | null;
    url: string;
    source: string | null;
    image: string | null;
    category: string | null;
    language: string;
    country: string;
    published_at: string;
}

export interface NewsRecord extends MediaStackNews {
    id?: number;
    title_hash: string;
    url_hash: string;
    created_at?: string;
}

export interface MediaStackResponse {
    pagination: {
        limit: number;
        offset: number;
        count: number;
        total: number;
    };
    data: MediaStackNews[];
} 