import { Injectable, UnauthorizedException } from '@nestjs/common';
    import { JwtService } from '@nestjs/jwt';
    import { UsersService } from '../users/users.service';
    import * as bcrypt from 'bcrypt';
    
    @Injectable()
    export class AuthService {
    constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
    ){}
    
    async validateUser(email: string, pass: string):
    Promise<any> {
    const user = await
    this.UsersService.findByEmail(email);
    if (user && await bcrypt.compare(pass,
    user.password)) {
    const { password, ...result } = user;
    return result;
    }
    throw new UnauthorizedException('Credenciales invalidas');
}
    async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
    access_token: this.jwtService.sign(payload)
    };
}
    async register(email: string, password: string) {
    const user = await this.UsersService.create(email,
    password);
    return this.login(user);
    }
}