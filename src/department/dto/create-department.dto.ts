import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Name of the department', example: 'Cardiology' })
  name: string;

  @ApiProperty({
    description: 'ID of the doctor associated with the department',
    example: 1,
  })
  doctorId: number;
}
