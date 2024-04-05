import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book entry' })
  @ApiResponse({
    status: 201,
    description: 'The book entry has been successfully created.',
  })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all book entries' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all book entries successfully.',
  })
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book entry by ID' })
  @ApiParam({ name: 'id', description: 'Book entry ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved book entry successfully.',
  })
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book entry by ID' })
  @ApiParam({ name: 'id', description: 'Book entry ID', type: 'string' })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({ status: 200, description: 'Updated book entry successfully.' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book entry by ID' })
  @ApiParam({ name: 'id', description: 'Book entry ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Deleted book entry successfully.' })
  async remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
