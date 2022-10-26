export class SignUpRequest {

    public constructor(init?: Partial<SignUpRequest>) {
        Object.assign(this, init);
    }

    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    email?: string;
}

