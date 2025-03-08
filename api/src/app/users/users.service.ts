import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@shared/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import crypto from 'crypto';
import process from 'node:process';
import * as path from 'node:path';
import { promisify } from 'util';
import * as fs from 'node:fs';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      this.logger.log('Get all users');
      return await this.userRepository.find();
    } catch (error) {
      throw new NotFoundException(error, 'Users not found');
    }
  }

  async findOneById(id: number): Promise<User> {
    this.logger.log(`Get user with id ${id}`);
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException('User not found');
    } else return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    this.logger.log(`Get user with email ${email}`);
    const user: User | null = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      this.logger.error(`User with email ${email} not found`);
      throw new NotFoundException('User not found');
    } else return user;
  }

  public async update(id: number, data: UpdateUserDto): Promise<User> {
    this.logger.log(`Get user with id ${id}`);
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (data.email && data.email !== user.email) {
      this.logger.log(`Get user with email ${data.email}`);
      const existingUser: User | null = await this.userRepository.findOneBy({
        email: data.email,
      });
      if (existingUser) {
        this.logger.fatal(
          `User with email ${user.email} want existing user with email ${existingUser.email}`,
        );
        throw new BadRequestException('Email is already in use');
      }
    }

    const updatableFields: string[] = [
      'email',
      'first_name',
      'last_name',
      'username',
      'thumbnail',
    ];

    for (const field of updatableFields) {
      if (field in data && data[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user[field] = data[field];
      }
    }

    try {
      this.logger.log(
        `Update user with id ${user.id} with data: ${JSON.stringify(updatableFields)}`,
      );
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(
        `Update user with id ${user.id} with data: ${JSON.stringify(error)}`,
      );
      throw new BadRequestException(
        'Failed to update user: ' + (error as Error).message,
      );
    }
  }

  public async updateThumbnail(
    id: number,
    file: Express.Multer.File,
  ): Promise<User> {
    if (!file) {
      this.logger.error(`No file uploaded`);
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
      );
    }

    this.logger.log(`Get user with id ${id}`);
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
    await mkdir(uploadsDir, { recursive: true });

    const fileExt = path.extname(file.originalname);
    const fileName = `${id}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, file.buffer);

    user.thumbnail = `/uploads/avatars/${fileName}`;

    return this.userRepository.save(user);
  }

  public async deleteThumbnail(id: number): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.thumbnail) {
      const avatarPath = path.join(
        process.cwd(),
        user.thumbnail.replace(/^\//, ''),
      );

      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }

      user.thumbnail = '';
      return this.userRepository.save(user);
    }

    return user;
  }

  public async updatePassword(id: number, data: UpdateUserDto): Promise<User> {
    const encoder: TextEncoder = new TextEncoder();
    const SALT: ArrayBuffer = encoder.encode(process.env.SALT).buffer;
    const salt: Buffer = Buffer.from(SALT);

    this.logger.log(`Get user with id ${id}`);
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (data.email && data.email !== user.email) {
      this.logger.error(
        `User with email ${data.email} want modify user with email: ${user.email}`,
      );
      throw new BadRequestException("Email do not match with you're account");
    }

    const hashedPassword: string = crypto
      .pbkdf2Sync(data.password, salt, 310000, 32, 'sha256')
      .toString('hex');

    if (data.password === hashedPassword) {
      user.password = crypto
        .pbkdf2Sync(data.new_password, salt, 310000, 32, 'sha256')
        .toString('hex');
    } else {
      this.logger.error(
        `User with email ${data.email} don't give correct password`,
      );
      throw new BadRequestException(
        "Password do not match with you're account",
      );
    }

    return await this.userRepository.save(user);
  }

  public async create(user: CreateUserDto): Promise<User> {
    try {
      this.logger.log(`Create user with user ${user.email}`);
      return await this.userRepository.save(user);
    } catch (err) {
      this.logger.error(`Failed to create user - ${(err as Error).message}`);
      throw new BadRequestException('Failed to create user');
    }
  }

  public async delete(id: number): Promise<User> {
    this.logger.log(`Delete user with id ${id}`);
    const user: User | null = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userRepository.remove(user);
  }
}
