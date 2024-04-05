import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './model/room.model';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room) private roomRepo: typeof Room) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      return await this.roomRepo.create(createRoomDto);
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.roomRepo.findAll({ include: { all: true } });
    } catch (error) {
      throw new Error(`Error finding all rooms: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.roomRepo.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding room by id ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    try {
      const [updatedRowsCount, [updatedRoom]] = await this.roomRepo.update(
        updateRoomDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRowsCount === 0) return null; // Room with provided id not found
      return updatedRoom;
    } catch (error) {
      throw new Error(`Error updating room with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const roomRows = await this.roomRepo.destroy({ where: { id } });
      if (roomRows === 0) return 'Not found'; // Room with provided id not found
      return 'successfully removed';
    } catch (error) {
      throw new Error(`Error removing room with id ${id}: ${error.message}`);
    }
  }
}
