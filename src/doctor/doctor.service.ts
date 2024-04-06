import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from './model/doctor.model';
import { JwtService } from '@nestjs/jwt';
import { DcotorMailService } from '../mail/DoctorMail.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { LoginDoctorDto } from './dto/login-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor) private doctorRepo: typeof Doctor,
    private readonly jwtService: JwtService,
    private readonly mailService: DcotorMailService,
  ) {}

  // Method to generate access and refresh tokens for a given doctor
  async getTokens(doctor: Doctor) {
    const payload = {
      id: doctor.id,
      fistName: doctor.firstName,
      lastName: doctor.lastName,
      isActive: doctor.isActive,
    };
    const [accessToken, refreshToken] = await Promise.all([
      // Signing access token with specified expiration and secret key
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY+"doctor",
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      // Signing refresh token with specified expiration and secret key
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY+"doctor",
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // Method to register a new admin
  async registration(createDoctorDto: CreateDoctorDto, res: Response) {
    // Check if admin with the same login already exists
    const admin = await this.doctorRepo.findOne({
      where: { email: createDoctorDto.email },
    });
    if (admin) {
      throw new BadRequestException('This admin already exists');
    }
    // Check if password and confirm password match
    if (createDoctorDto.password !== createDoctorDto.confirmPassword) {
      throw new BadRequestException('Password does not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 7);
    // Create a new admin with hashed password
    const newPatient = await this.doctorRepo.create({
      ...createDoctorDto,
      hashedPassword,
    });

    // Generate tokens for the new admin
    const tokens = await this.getTokens(newPatient);

    // Hash the refresh token and generate activation link
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
    const activationLink = v4();

    // Update the admin with hashed refresh token and activation link
    const updatedPatient = await this.doctorRepo.update(
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
    const updatAdmin = await this.doctorRepo.update(
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
      message: 'Patient activated successfully',
      admin: updatAdmin[1][0].isActive,
    };
    return response;
  }

  async login(loginDoctorDto: LoginDoctorDto, res: Response) {
    const { email, password } = loginDoctorDto;
    const admin = await this.doctorRepo.findOne({ where: { email } });
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
    const updatedadmin = await this.doctorRepo.update(
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
      throw new ForbiddenException('Doctor not verified');
    }

    const updatedPatient = await this.doctorRepo.update(
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
      message: 'doctor logged out successfully',
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
    const admin = await this.doctorRepo.findOne({ where: { id: patientId } });

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
    const updatedpatient = await this.doctorRepo.update(
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

  // -----------------------------------------

  async create(createDoctorDto: CreateDoctorDto) {
    try {
      return await this.doctorRepo.create(createDoctorDto);
    } catch (error) {
      throw new Error(`Error creating doctor: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.doctorRepo.findAll({ include: { all: true } });
    } catch (error) {
      throw new Error(`Error finding all doctors: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.doctorRepo.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding doctor by id ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    try {
      const [updatedRowsCount, [updatedDoctor]] = await this.doctorRepo.update(
        updateDoctorDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRowsCount === 0) return null; // Doctor with provided id not found
      return updatedDoctor;
    } catch (error) {
      throw new Error(`Error updating doctor with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const docRows = await this.doctorRepo.destroy({ where: { id } });
      if (docRows === 0) return 'Not found'; // Doctor with provided id not found
      return 'successfully removed';
    } catch (error) {
      throw new Error(`Error removing doctor with id ${id}: ${error.message}`);
    }
  }
}
