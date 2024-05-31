export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto extends LoginDto {
    name: string;
}