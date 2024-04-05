import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Patient } from '../patient/model/patient.model';

@Injectable()
export class PatientMailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(patient: Patient) {
    const url = `${process.env.API_HOST}:${process.env.PORT}/patient/activate/${patient.activationLink}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: patient.email,
      subject: 'Welcome to stadium app! Confirmation your email',
      template: './confirmation',
      context: {
        name: patient.firstName,
        url,
      },
    });
  }
}
