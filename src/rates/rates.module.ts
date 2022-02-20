import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RatesRepository } from './rates.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([RatesRepository]),
    AuthModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
