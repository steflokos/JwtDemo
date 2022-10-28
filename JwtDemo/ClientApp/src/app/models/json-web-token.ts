export interface JsonWebToken{
    exp: number;
    iat: number ;
    iss: string ;
    sub: string ;
    roles: [];
    unique_name:string ;

}