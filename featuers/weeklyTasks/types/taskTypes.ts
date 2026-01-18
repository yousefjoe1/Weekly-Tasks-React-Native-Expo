export interface ApiErrorMessage<T> {
    message: string;
    code?: number;
    error?: unknown;
    data?: T;
}