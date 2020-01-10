export interface Mutation<P = any> {
    type: string;
    payload: P;
}

export interface Action<P = any> {
    type: string;
    payload: P;
}