import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

type UserPayload = {
  userId: string;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    try {
      console.log('Intentando iniciar sesion', user.username);
      
      // si el usuario existe
      const userFromDb = await this.usersRepository.findOne({ 
        where: { username: user.username },
        select: ['id', 'username']
      });

      console.log('Usuario encontrado', userFromDb);

      if (!userFromDb) {
        console.log('Usuario no encontrado');
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const payload: UserPayload = { 
        username: userFromDb.username, 
        userId: userFromDb.id 
      };
      
      console.log('Generando token', payload);
      
      const token = this.jwtService.sign(payload);
      console.log('Token generado');
      
      return {
        access_token: token,
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async register(registerDto: { username: string; password: string }) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = this.usersRepository.create({
      username: registerDto.username,
      password: hashedPassword,
      totalGames: 0,
      totalWins: 0,
    });

    await this.usersRepository.save(user);
    
    const { password, ...result } = user;
    return result;
  }
}
