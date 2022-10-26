export interface JsonWebToken{
    exp: number;
    iat: number ;
    iss: string ;
    sub: string ;
    role: [];
    unique_name:string ;

}