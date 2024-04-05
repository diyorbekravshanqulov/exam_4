import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from './model/patient.model';
import { JwtService } from '@nestjs/jwt';
import { PatientMailService } from '../mail/PatientMail.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { LoginPatientDto } from './dto/login_admin.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientRepo: typeof Patient,
    private readonly jwtService: JwtService,
    private readonly mailService: PatientMailService,
  ) {}

  // Method to generate access and refresh tokens for a given patient
  async getTokens(patient: Patient) {
    const payload = {
      id: patient.id,
      fistName: patient.firstName,
      lastName: patient.lastName,
      isActive: patient.isActive,
    };
    const [accessToken, refreshToken] = await Promise.all([
      // Signing access token with specified expiration and secret key
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      // Signing refresh token with specified expiration and secret key
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // Method to register a new admin
  async registration(createPatientDto: CreatePatientDto, res: Response) {
    // Check if admin with the same login already exists
    const admin = await this.patientRepo.findOne({
      where: { email: createPatientDto.email },
    });
    if (admin) {
      throw new BadRequestException('This admin already exists');
    }
    // Check if password and confirm password match
    if (createPatientDto.password !== createPatientDto.comfirmPassword) {
      throw new BadRequestException('Password does not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createPatientDto.password, 7);
    // Create a new admin with hashed password
    const newPatient = await this.patientRepo.create({
      ...createPatientDto,
      hashedPassword,
    });

    // Generate tokens for the new admin
    const tokens = await this.getTokens(newPatient);

    // Hash the refresh token and generate activation link
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
    const activationLink = v4();

    // Update the admin with hashed refresh token and activation link
    const updatedPatient = await this.patientRepo.update(
      { hashedRefreshToken, activationLink },
      { where: { id: newPatient.id }, returning: true },
    );

    // Set refresh token as a cookie in the response
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 1000, // 15 days expiration time
      httpOnly: true, // HTTP only cookie
    });

    try {
      await this.mailService.sendMail(updatedPatient[1][0]);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Send error');
    }

    // Prepare response object
    const response = {
      message: 'Patient registered',
      patient: updatedPatient[1][0],
      tokens,
    };

    return response; // Return the response object
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link not found');
    }
    const updatAdmin = await this.patientRepo.update(
      { isActive: true },
      {
        where: { activationLink: link, isActive: false },
        returning: true,
      },
    );
    if (!updatAdmin[1][0]) {
      throw new BadRequestException('admin already activated');
    }
    const response = {
      message: 'Doctor activated successfully',
      admin: updatAdmin[1][0].isActive,
    };
    return response;
  }

  async login(loginPatientDto: LoginPatientDto, res: Response) {
    const { email, password } = loginPatientDto;
    const admin = await this.patientRepo.findOne({ where: { email } });
    if (!admin) {
      throw new BadRequestException('admin not found');
    }
    if (!admin.isActive) {
      throw new BadRequestException('admin not activated');
    }
    const isMatchPass = await bcrypt.compare(password, admin.hashedPassword);

    if (!isMatchPass) {
      throw new BadRequestException('Password is not match');
    }

    const tokens = await this.getTokens(admin);

    // Hash the refresh token and generate activation link
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);

    // Update the admin with hashed refresh token and activation link
    const updatedadmin = await this.patientRepo.update(
      { hashedRefreshToken },
      { where: { id: admin.id }, returning: true },
    );

    // Set refresh token as a cookie in the response
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 1000, // 15 days expiration time
      httpOnly: true, // HTTP only cookie
    });

    // Prepare response object
    const response = {
      message: 'admin registered',
      admin: updatedadmin[1][0],
      tokens,
    };

    return response; // Return the response object
  }

  async logout(refreshToken: string, res: Response) {
    const patientData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!patientData) {
      throw new ForbiddenException('Admin not verified');
    }

    const updatedPatient = await this.patientRepo.update(
      {
        hashedPassword: null,
      },
      {
        where: { id: patientData.id },
        returning: true,
      },
    );
    res.clearCookie('refresh_token');
    const reponse = {
      message: 'patient logged out successfully',
      patient_refresh_token: updatedPatient[1][0].hashedRefreshToken,
    };
    return reponse;
  }

  async refreshToken(patientId: number, refreshToken: string, res: Response) {
    console.log(refreshToken);

    const decodecToken = await this.jwtService.decode(refreshToken);
    if (patientId != decodecToken['id']) {
      throw new BadRequestException('admin not found');
    }
    const admin = await this.patientRepo.findOne({ where: { id: patientId } });

    if (!admin || !admin.hashedRefreshToken) {
      throw new BadRequestException('admin not found');
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      admin.hashedRefreshToken,
    );

    if (!tokenMatch) {
      throw new ForbiddenException('Forbiddin');
    }

    const tokens = await this.getTokens(admin);

    // Hash the refresh token and generate activation link
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);

    // Update the admin with hashed refresh token and activation link
    const updatedpatient = await this.patientRepo.update(
      { hashedRefreshToken },
      { where: { id: admin.id }, returning: true },
    );

    // Set refresh token as a cookie in the response
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 1000, // 15 days expiration time
      httpOnly: true, // HTTP only cookie
    });

    // Prepare response object
    const response = {
      message: 'admin refreshed',
      admin: updatedpatient[1][0],
      tokens,
    };

    return response;
  }

  // ----------------------------

  async create(createPatientDto: CreatePatientDto) {
    try {
      return await this.patientRepo.create(createPatientDto);
    } catch (error) {
      throw new Error(`Error creating patient: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.patientRepo.findAll({ include: { all: true } });
    } catch (error) {
      throw new Error(`Error finding all patients: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.patientRepo.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding patient by id ${id}: ${error.message}`);
    }
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    try {
      const [updatedRowsCount, [updatedPatient]] =
        await this.patientRepo.update(updatePatientDto, {
          where: { id },
          returning: true,
        });
      if (updatedRowsCount === 0) return null; // Patient with provided id not found
      return updatedPatient;
    } catch (error) {
      throw new Error(`Error updating patient with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const patientRows = await this.patientRepo.destroy({ where: { id } });
      if (patientRows === 0) return 'Not found'; // Patient with provided id not found
      return 'successfully removed';
    } catch (error) {
      throw new Error(`Error removing patient with id ${id}: ${error.message}`);
    }
  }
}
