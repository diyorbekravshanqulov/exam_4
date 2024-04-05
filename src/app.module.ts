// Importing required modules from Nest.js framework
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/model/admin.model';
import { MailModule } from './mail/mail.module';
import { FiedModule } from './fied/fied.module';
import { PaymentModule } from './payment/payment.module';
import { PatientModule } from './patient/patient.module';
import { Field } from './fied/model/fied.model';
import { Payment } from './payment/model/payment.model';
import { Patient } from './patient/model/patient.model';
import { DoctorModule } from './doctor/doctor.module';
import { Doctor } from './doctor/model/doctor.model';
import { DepartmentModule } from './department/department.module';
import { RoomModule } from './room/room.module';
import { BookModule } from './book/book.module';
import { Department } from './department/model/department.model';
import { Room } from './room/model/room.model';
import { Book } from './book/model/book.model';

@Module({
  imports: [
    // Importing configuration module to load environment variables
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),

    // Setting up Sequelize for database operations
    SequelizeModule.forRoot({
      dialect: 'postgres', // Using PostgreSQL dialect
      host: process.env.POSTGRES_HOST, // Getting host from environment variables
      port: Number(process.env.POSTGRES_PORT), // Getting port from environment variables
      username: process.env.POSTGRES_USER, // Getting username from environment variables
      password: process.env.POSTGRES_PASSWORD, // Getting password from environment variables
      database: process.env.POSTGRES_DB, // Getting database name from environment variables
      models: [Admin, Field, Payment, Patient, Doctor, Department, Room, Book], // Associating Sequelize models with the database
      autoLoadModels: true, // Automatically loading models from the specified paths
      sync: { alter: true }, // Synchronizing database schema with model definitions (altering tables)
      logging: true, // Enabling logging for database operations
    }),
    MailModule,
    AdminModule,
    FiedModule,
    PaymentModule,
    PatientModule,
    DoctorModule,
    DepartmentModule,
    RoomModule,
    BookModule,
    // Importing various modules for different functionalities
  ],
  controllers: [], // No controllers defined in this module
  providers: [], // No providers defined in this module
})
export class AppModule {} // Exporting AppModule class as the root module of the application
