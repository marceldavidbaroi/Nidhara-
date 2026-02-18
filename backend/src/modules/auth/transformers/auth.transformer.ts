import { AuthTokensResponseDto } from '../dto/auth.response.dto';

export type AuthSessionOutput = {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  sessionId?: string;
  expiresIn: number;
};

export function toAuthTokensResponse(out: AuthSessionOutput): AuthTokensResponseDto {
  return {
    accessToken: out.accessToken,
    csrfToken: out.csrfToken,
    expiresIn: out.expiresIn,
  };
}
