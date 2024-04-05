import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDepartmentDto {
  @ApiPropertyOptional({
    description: 'Name of the department',
    example: 'Cardiology',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'ID of the doctor associated with the department',
    example: 1,
  })
  doctorId?: number;
}
