import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FiedService } from './fied.service';
import { CreateFiedDto } from './dto/create-fied.dto';
import { UpdateFiedDto } from './dto/update-fied.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Field } from './model/fied.model';

@ApiTags('fied')
@Controller('fied')
export class FiedController {
  constructor(private readonly fiedService: FiedService) {}

  @ApiOperation({ summary: 'Create a new field' })
  @ApiResponse({ status: 201, type: Field })
  @Post()
  async create(@Body() createFiedDto: CreateFiedDto) {
    return this.fiedService.create(createFiedDto);
  }

  @ApiOperation({ summary: 'Get all fields' })
  @ApiResponse({ status: 200, type: [Field] })
  @Get()
  async findAll() {
    return this.fiedService.findAll();
  }

  @ApiOperation({ summary: 'Get a field by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, type: Field })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.fiedService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a field by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, type: Field })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFiedDto: UpdateFiedDto) {
    return this.fiedService.update(+id, updateFiedDto);
  }

  @ApiOperation({ summary: 'Delete a field by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.fiedService.remove(+id);
  }
}
