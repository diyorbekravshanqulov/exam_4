import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './model/admin.model';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { LoginAdminDto } from './dto/login_admin.dto';
import { AdminMailService } from '../mail/Adminmail.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminRepo: typeof Admin,
    private readonly jwtService: JwtService,
    private readonly mailService: AdminMailService, // Injecting the JwtService for token generation
  ) {}

  // Method to generate access and refresh tokens for a given admin
  async getTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      fullName: admin.fullName,
      isActive: admin.isActive,
      isCreator: admin.isCreator,
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
  async registration(createAdminDto: CreateAdminDto, res: Response) {
    // Check if admin with the same login already exists
    const admin = await this.adminRepo.findOne({
      where: { email: createAdminDto.email },
    });
    if (admin) {
      throw new BadRequestException('This admin already exists');
    }
    // Check if password and confirm password match
    if (createAdminDto.password !== createAdminDto.confirmPassword) {
      throw new BadRequestException('Password does not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 7);
    // Create a new admin with hashed password
    const newAdmin = await this.adminRepo.create({
      ...createAdminDto,
      hashedPassword,
    });

    // Generate tokens for the new admin
    const tokens = await this.getTokens(newAdmin);

    // Hash the refresh token and generate activation link
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
    const activationLink = v4();

    // Update the admin with hashed refresh token and activation link
    const updatedAdmin = await this.adminRepo.update(
      { hashedRefreshToken, activationLink },
      { where: { id: newAdmin.id }, returning: true },
    );

    // Set refresh token as a cookie in the response
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 1000, // 15 days expiration time
      httpOnly: true, // HTTP only cookie
    });

    try {
      await this.mailService.sendMail(updatedAdmin[1][0]);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Send error');
    }

    // Prepare response object
    const response = {
      message: 'Admin registered',
      admin: updatedAdmin[1][0],
      tokens,
    };

    return response; // Return the response object
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link not found');
    }
    const updatAdmin = await this.adminRepo.update(
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
      message: 'admin activated successfully',
      admin: updatAdmin[1][0].isActive,
    };
    return response;
  }

  async login(loginAdminDto: LoginAdminDto, res: Response) {
    const { email, password } = loginAdminDto;
    const admin = await this.adminRepo.findOne({ where: { email } });
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
    const updatedadmin = await this.adminRepo.update(
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
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!userData) {
      throw new ForbiddenException('Admin not verified');
    }

    const updateAdmin = await this.adminRepo.update(
      {
        hashedPassword: null,
      },
      {
        where: { id: userData.id },
        returning: true,
      },
    );
    res.clearCookie('refresh_token');
    const reponse = {
      message: 'admin logged out successfully',
      user_refresh_token: updateAdmin[1][0].hashedRefreshToken,
    };
    return reponse;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    console.log(refreshToken);

    const decodecToken = await this.jwtService.decode(refreshToken);
    if (userId != decodecToken['id']) {
      throw new BadRequestException('admin not found');
    }
    const admin = await this.adminRepo.findOne({ where: { id: userId } });

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
    const updatedUser = await this.adminRepo.update(
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
      admin: updatedUser[1][0],
      tokens,
    };

    return response;
  }

  async create(createAdminDto: CreateAdminDto) {
    try {
      const admin = await this.adminRepo.create(createAdminDto);
      return admin;
    } catch (error) {
      throw new Error(`Error creating admin: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const admin = await this.adminRepo.findAll();
      if (!admin || admin.length === 0) return 'Empty';
      return admin;
    } catch (error) {
      throw new Error(`Error finding all admins: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.adminRepo.findByPk(id);
      if (!admin) return 'Empty';
      return admin;
    } catch (error) {
      throw new Error(`Error finding admin by id ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const [updatedRowsCount, [updatedAdmin]] = await this.adminRepo.update(
        updateAdminDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRowsCount === 0) return 'Empty';
      return updatedAdmin;
    } catch (error) {
      throw new Error(`Error updating admin with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const adminRows = await this.adminRepo.destroy({ where: { id } });
      if (adminRows === 0) return 'Not found';
      return 'successfully removed';
    } catch (error) {
      throw new Error(`Error removing admin with id ${id}: ${error.message}`);
    }
  }
}
