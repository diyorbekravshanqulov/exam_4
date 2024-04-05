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
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Patient } from './model/patient.model';
import { Response } from 'express';
import { CookieGetter } from '../decorators/cookieGetter.decorator';
import { LoginPatientDto } from './dto/login_admin.dto';
import { jwtGuard } from '../guards/jwtguard.guard';

@ApiTags('patient')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Create a new patient' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'The patient has been successfully created.',
    type: Patient,
  })
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({
    status: 200,
    description: 'Return all patients.',
    type: [Patient],
  })
  @UseGuards(jwtGuard)
  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the patient.',
    type: Patient,
  })
  @UseGuards(jwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a patient by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePatientDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(+id, updatePatientDto);
  }

  @ApiOperation({ summary: 'Delete a patient by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The patient has been successfully deleted.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(+id);
  }

  @ApiOperation({ summary: 'Sign up as a new patient' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'The patient has been successfully registered.',
  })
  @Post('signup')
  signup(
    @Body() createPatientDto: CreatePatientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.patientService.registration(createPatientDto, res);
  }

  @ApiOperation({ summary: 'Log in as a patient' })
  @ApiBody({ type: LoginPatientDto })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @HttpCode(200)
  @Post('login')
  login(
    @Body() loginPatientDto: LoginPatientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.patientService.login(loginPatientDto, res);
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
    return this.patientService.refreshToken(id, refreshToken, res);
  }

  @ApiOperation({ summary: 'Log out as a patient' })
  @HttpCode(200)
  @UseGuards(jwtGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.patientService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: 'Activate patient account' })
  @Get('activate/:link')
  activate(@Param('link') link: string) {
    return this.patientService.activate(link);
  }
}
