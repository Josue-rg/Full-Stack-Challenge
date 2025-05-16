import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    return { message: 'Usuario registrado exitosamente' };
  }

  async login(username: string, password: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { username } });
      if (!user) {
        console.log('Usuario no encontrado');
        throw new BadRequestException('Usuario o contraseña incorrectos');
      }

      console.log('Usuario encontrado:', user.username);
      console.log('Contraseña ingresada:', password);
      console.log('Contraseña en base de datos:', user.password);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Contraseña no válida');
        throw new BadRequestException('Usuario o contraseña incorrectos');
      }

      console.log('Contraseña válida');
      const payload = { username: user.username, userId: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    
    const { password: hashedPassword, ...result } = user;
    return result;
  }

  async getAllUsers() {
    const users = await this.usersRepository.find();
    return users.map(user => ({
      id: user.id,
      username: user.username
    }));
  }
}
