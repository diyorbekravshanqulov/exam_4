import { Injectable } from '@nestjs/common';
import { CreateFiedDto } from './dto/create-fied.dto';
import { UpdateFiedDto } from './dto/update-fied.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Field } from './model/fied.model';

@Injectable()
export class FiedService {
  constructor(@InjectModel(Field) private fieldRepo: typeof Field) {}

  async create(createFiedDto: CreateFiedDto) {
    try {
      return await this.fieldRepo.create(createFiedDto);
    } catch (error) {
      throw new Error(`Error creating field: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.fieldRepo.findAll();
    } catch (error) {
      throw new Error(`Error finding all fields: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.fieldRepo.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding field by id ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateFiedDto: UpdateFiedDto) {
    try {
      const [updatedRowsCount, [updatedField]] = await this.fieldRepo.update(
        updateFiedDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRowsCount === 0) return null; // Field with provided id not found
      return updatedField;
    } catch (error) {
      throw new Error(`Error updating field with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const fieldRows = await this.fieldRepo.destroy({ where: { id } });
      if (fieldRows === 0) return 'Not found'; // Field with provided id not found
      return 'successfully removed';
    } catch (error) {
      throw new Error(`Error removing field with id ${id}: ${error.message}`);
    }
  }
}
