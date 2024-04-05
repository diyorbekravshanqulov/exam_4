import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Doctor } from '../doctor/model/doctor.model';

@Injectable()
export class DcotorMailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(doctor: Doctor) {
    const url = `${process.env.API_HOST}:${process.env.PORT}/doctor/activate/${doctor.activationLink}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: doctor.email,
      subject: 'Welcome to stadium app! Confirmation your email',
      template: './confirmation',
      context: {
        name: doctor.firstName,
        url,
      },
    });
  }
}
