import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination.dto';

export class ApiResponseDto<T> {
  statusCode: number;
  message: string;
  data: T;

  @ApiPropertyOptional({ type: () => PaginationMetaDto })
  meta?: PaginationMetaDto;
}
