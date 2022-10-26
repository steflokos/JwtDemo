import { Role } from "./role";

export interface DbUser {

    username?: string;
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    email?: string;
    country: string;
    roles? :Role[];
}