import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Response } from 'express';
import { CookieGetter } from '../decorators/cookieGetter.decorator';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { jwtGuard } from '../guards/jwtguard.guard';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({
    status: 201,
    description: 'The doctor has been successfully created.',
  })
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return await this.doctorService.create(createDoctorDto);
  }

  @UseGuards(jwtGuard)
  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all doctors successfully.',
  })
  async findAll() {
    return await this.doctorService.findAll();
  }

  @UseGuards(jwtGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiParam({ name: 'id', description: 'Doctor ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Retrieved doctor successfully.' })
  async findOne(@Param('id') id: string) {
    return await this.doctorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a doctor by ID' })
  @ApiParam({ name: 'id', description: 'Doctor ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Updated doctor successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return await this.doctorService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a doctor by ID' })
  @ApiParam({ name: 'id', description: 'Doctor ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Deleted doctor successfully.' })
  async remove(@Param('id') id: string) {
    return await this.doctorService.remove(+id);
  }

  @ApiOperation({ summary: 'Sign up as a new patient' })
  @ApiBody({ type: CreateDoctorDto })
  @ApiResponse({
    status: 201,
    description: 'The patient has been successfully registered.',
  })
  @Post('signup')
  signup(
    @Body() createDoctorDto: CreateDoctorDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.doctorService.registration(createDoctorDto, res);
  }

  @ApiOperation({ summary: 'Log in as a patient' })
  @ApiBody({ type: LoginDoctorDto })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @HttpCode(200)
  @Post('login')
  login(
    @Body() loginDoctorDto: LoginDoctorDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.doctorService.login(loginDoctorDto, res);
  }

  @ApiOperation({ summary: 'Refresh token for a patient' })
  @ApiParam({ name: 'id', type: Number })
  @HttpCode(200)
  @Post(':id/refresh')
  refresh(
    @Param('id') id: number,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.doctorService.refreshToken(id, refreshToken, res);
  }

  @ApiOperation({ summary: 'Log out as a patient' })
  @HttpCode(200)
  @UseGuards(jwtGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.doctorService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: 'Activate patient account' })
  @Get('activate/:link')
  activate(@Param('link') link: string) {
    return this.doctorService.activate(link);
  }
}
