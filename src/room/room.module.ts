import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './model/room.model';

@Module({
  imports: [SequelizeModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
