import { Module } from '@nestjs/common';
import { FiedService } from './fied.service';
import { FiedController } from './fied.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Field } from './model/fied.model';

@Module({
  imports: [SequelizeModule.forFeature([Field])],
  controllers: [FiedController],
  providers: [FiedService],
})
export class FiedModule {}
