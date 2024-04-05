import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './model/book.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book)
    private readonly bookRepo: typeof Book,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      return await this.bookRepo.create(createBookDto);
    } catch (error) {
      throw new Error(`Error creating book: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const books = await this.bookRepo.findAll({ include: { all: true } });
      if (!books || books.length === 0) return 'Empty';
      return books;
    } catch (error) {
      throw new Error(`Error finding all books: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const book = await this.bookRepo.findByPk(id);
      if (!book) return 'Empty';
      return book;
    } catch (error) {
      throw new Error(`Error finding book by id ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const [updatedRowsCount, [updatedBook]] = await this.bookRepo.update(
        updateBookDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRowsCount === 0) return 'Empty';
      return updatedBook;
    } catch (error) {
      throw new Error(`Error updating book with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const bookRows = await this.bookRepo.destroy({ where: { id } });
      if (bookRows === 0) return 'Not found';
      return 'successfully removed';
    } catch (error) {
      throw new Error(`Error removing book with id ${id}: ${error.message}`);
    }
  }
}
