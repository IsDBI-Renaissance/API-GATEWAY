import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidEmail } from '../../common/validators/email.validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsValidEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
} 