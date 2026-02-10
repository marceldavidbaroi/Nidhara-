import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  csrfToken: string;
}
