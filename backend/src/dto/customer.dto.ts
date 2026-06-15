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

  @IsOptional()
  liveLocation?: string;

  @IsOptional()
  profileImage?: string;
}

export class CustomerProfileUpdateDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  mobile: string;

  @IsOptional()
  profileImage?: string;
}

export class CustomerDeliveryDetailsDto {
  @IsNotEmpty()
  deliveryLocation: string;

  @IsNotEmpty()
  streetAddress: string;

  @IsNotEmpty()
  receiverName: string;

  @IsNotEmpty()
  receiverMobile: string;

  @IsOptional()
  homeImage?: string;
}

export class CustomerPasswordUpdateDto {
  @IsNotEmpty()
  previousPassword: string;

  @IsNotEmpty()
  @MinLength(4)
  newPassword: string;
}
