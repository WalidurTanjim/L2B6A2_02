export type User = {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "admin" | "customer";
}

export type LoginUser = {
    email: string;
    password: string;
}

export type UpdateUser = {
    name?: string;
    email?: string;
    phone?: string;
    role?: "admin" | "customer"
}