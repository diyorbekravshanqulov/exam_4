import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Admin } from '../admin/model/admin.model';

@Injectable()
export class AdminMailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(admin: Admin) {
    const url = `${process.env.API_HOST}:${process.env.PORT}/admin/activate/${admin.activationLink}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: admin.email,
      subject: 'Welcome to stadium app! Confirmation your email',
      template: './confirmation',
      context: {
        name: admin.fullName,
        url,
      },
    });
  }
}
