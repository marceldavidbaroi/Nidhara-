import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Short-lived access token (JWT)',
  })
  accessToken: string;

  @ApiProperty({
    example: 'b1b0a9b8c7d6e5f4a3b2c1d0e9f8a7b6',
    description: 'CSRF token used with refresh rotation',
  })
  csrfToken: string;

  @ApiProperty({
    example: 900,
    description: 'Access token TTL in seconds',
  })
  expiresIn: number;
}

export class OkResponseDto {
  @ApiProperty({ example: true })
  ok: boolean;
}
