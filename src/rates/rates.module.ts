import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RatesRepository } from './rates.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([RatesRepository]),
    AuthModule,
    HttpModule,
  ],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
