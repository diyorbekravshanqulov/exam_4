import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'The room has been successfully created.',
  })
  async create(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all rooms successfully.',
  })
  async findAll() {
    return await this.roomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiResponse({ status: 200, description: 'Retrieved room successfully.' })
  async findOne(@Param('id') id: string) {
    return await this.roomService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a room by ID' })
  @ApiResponse({ status: 200, description: 'Updated room successfully.' })
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return await this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room by ID' })
  @ApiResponse({ status: 200, description: 'Deleted room successfully.' })
  async remove(@Param('id') id: string) {
    return await this.roomService.remove(+id);
  }
}
