import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from './model/department.model';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department)
    private departmentRepo: typeof Department,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    try {
      return await this.departmentRepo.create(createDepartmentDto);
    } catch (error) {
      throw new Error(`Error creating department: ${error.message}`);
    }
  }

  async findAll(): Promise<Department[]> {
    try {
      return await this.departmentRepo.findAll({ include: { all: true } });
    } catch (error) {
      throw new Error(`Error finding all departments: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Department | null> {
    try {
      return await this.departmentRepo.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding department by id ${id}: ${error.message}`);
    }
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department | null> {
    try {
      const [updatedRowsCount, [updatedDepartment]] =
        await this.departmentRepo.update(updateDepartmentDto, {
          where: { id },
          returning: true,
        });
      if (updatedRowsCount === 0) return null; // Department with provided id not found
      return updatedDepartment;
    } catch (error) {
      throw new Error(
        `Error updating department with id ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const departRows = await this.departmentRepo.destroy({ where: { id } });
      if (departRows === 0) return 'Not found'; // Department with provided id not found
      return 'successfully removed';
    } catch (error) {
      throw new Error(
        `Error removing department with id ${id}: ${error.message}`,
      );
    }
  }
}
