import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@shared/entities/User.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { RegisterPayloadDto } from './dto/register.dto';
import { UsersService } from 'src/app/users/users.service';
import sgMail from '@sendgrid/mail';
import { ResetPassword } from '@shared/entities/ResetPassword.entity';

const encoder: TextEncoder = new TextEncoder();
const SALT: ArrayBuffer = encoder.encode(process.env.SALT).buffer;
const salt: Buffer = Buffer.from(SALT);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(ResetPassword)
    private resetPasswordRepository: Repository<ResetPassword>,
  ) {}

  public async validateUser({
    email,
    password,
  }: AuthPayloadDto): Promise<{ message: string; token: string }> {
    try {
      const findUser: User | null = await this.userRepository.findOneBy({
        email: email,
      });
      if (!findUser)
        throw new UnauthorizedException('Invalid email or password');

      const hashedPassword: string = crypto
        .pbkdf2Sync(password, salt, 310000, 32, 'sha256')
        .toString('hex');

      if (hashedPassword !== findUser.password) {
        console.error('Invalid Password');
        throw new UnauthorizedException('Invalid email or password');
      }

      const userForToken = {
        id: findUser.id,
        email: findUser.email,
        username: findUser.username,
      };
      const token: string = this.jwtService.sign(userForToken);
      return { message: 'Login succesful', token };
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  }

  public async createUser(
    authPayload: RegisterPayloadDto,
  ): Promise<{ message: string; token: string }> {
    try {
      if (authPayload.password !== authPayload.confirm_password)
        new HttpException('Password do not match !', 400);
      const existingUser = await this.userRepository.findOneBy({
        email: authPayload.email,
      });
      if (existingUser) new HttpException('Error during registration', 403);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirm_password, ...user } = authPayload;
      user.password = crypto
        .pbkdf2Sync(user.password, salt, 310000, 32, 'sha256')
        .toString('hex');
      const newUser: User = await this.userService.create(user);

      const userForToken = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      };

      const token: string = await this.jwtService.signAsync(userForToken);
      return { message: 'Resgistration succesful', token };
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  }

  async getTemplate(path: string): Promise<string> {
    const response = await fetch(path);
    return response.text();
  }

  populateTemplate(
    template: string,
    variables: Record<string, string>,
  ): string {
    let populatedTemplate = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      populatedTemplate = populatedTemplate.replace(placeholder, value);
    }

    return populatedTemplate;
  }

  public async forgotPassword(email: string): Promise<void> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const user: User | null = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return;
    }

    const resetLink: string = `${process.env.FRONTEND_URL}/reset_password?email=${email}`;
    const template: string = await this.getTemplate(
      `@app/templates/resetpassword.html`,
    );

    const populatedTemplate = this.populateTemplate(template, {
      reset_link: resetLink,
      link_expiry_min: '15',
    });

    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = populatedTemplate;

    const msg = {
      to: email,
      from: 'no-reply.tempestboard@gloupi.com',
      subject: 'Project Invitation',
      html: container.innerHTML,
    };

    await sgMail.send(msg);
    await this.resetPasswordRepository.save({
      email,
      link_expiry_min: '15',
    });
  }

  public async resetPassword(authPayload: {
    email: string;
    password: string;
    confirm_password: string;
  }): Promise<void> {
    try {
      if (authPayload.password !== authPayload.confirm_password)
        new HttpException('Password do not match !', 400);
      const existingUser = await this.userRepository.findOneBy({
        email: authPayload.email,
      });
      if (!existingUser) throw new HttpException('Error during reset', 403);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirm_password, ...user } = authPayload;
      existingUser.password = crypto
        .pbkdf2Sync(user.password, salt, 310000, 32, 'sha256')
        .toString('hex');

      await this.userRepository.save(existingUser);
    } catch (err) {
      console.error('Reset Password failed', err);
      throw err;
    }
  }
}
