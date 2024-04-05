import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './model/payment.model';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Payment) private payRepo: typeof Payment) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      return await this.payRepo.create(createPaymentDto);
    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.payRepo.findAll({ include: { all: true } });
    } catch (error) {
      throw new Error(`Error finding all payments: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.payRepo.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding payment by id ${id}: ${error.message}`);
    }
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const [updatedRowsCount, [updatedPayment]] = await this.payRepo.update(
        updatePaymentDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRowsCount === 0) return null; // Payment with provided id not found
      return updatedPayment;
    } catch (error) {
      throw new Error(`Error updating payment with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const paymentRows = await this.payRepo.destroy({ where: { id } });
      if (paymentRows === 0) return 'Not found'; // Payment with provided id not found
      return 'successfully removed';
    } catch (error) {
      throw new Error(`Error removing payment with id ${id}: ${error.message}`);
    }
  }
}
