import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        if (!email) return null;
        return this.userRepository.findOne({ where: { email: email.toLowerCase().trim() } });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.findByEmail(createUserDto.email);
        
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }
}
