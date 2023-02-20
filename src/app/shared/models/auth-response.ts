import { User } from "./user";

export class AuthResponse {
    user: User;
    access_token: string;

    constructor() {
        this.user = new User(); 
        this.access_token = "";
    }
}
