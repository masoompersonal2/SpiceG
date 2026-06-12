import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CustomerLoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;
}

export class CustomerSignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;
}

export class CustomerSetupDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  location: string;

  @IsOptional()
  profileImage?: string;
}
