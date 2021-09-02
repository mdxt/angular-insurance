export class User {
    username: string;
    authToken: string; 
    authorities: string[]; 
    expiry: number; 
    constructor(username: string,
                authToken: string,
                authorities: string[],
                expiry: number) {
        this.username = username;
        this.authToken = authToken; 
        this.authorities = authorities; 
        this.expiry = expiry;            
    }
}
