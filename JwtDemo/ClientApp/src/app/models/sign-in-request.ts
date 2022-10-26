export class SignInRequest {

    public constructor(init?: Partial<SignInRequest>) {
        Object.assign(this, init);
    }

    username?: string;
    password?: string;
        
}