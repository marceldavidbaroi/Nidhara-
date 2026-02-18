import { IsEmail, IsString, MinLength } from 'class-validator';
import { IsStrongPassword } from '@/common/validator/is-strong-password.decorator';


export class SignupDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  displayName: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;
}
