import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { Patient } from './model/patient.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([Patient]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
