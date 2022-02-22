import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { CreateRateDto } from './dto/create-rate.dto';
import { Rate } from './entities/rate.entity';
import { RatesRepository } from './rates.repository';

const EVERY_6_HOURS = 1 * 6 * 60 * 60 * 1000;

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(RatesRepository) private ratesRepository: RatesRepository,
  ) {}
  create(createRateDto: CreateRateDto) {
    return this.ratesRepository.createRate(createRateDto);
  }

  async findLast(): Promise<Rate> {
    try {
      const rate = await this.ratesRepository.findLast();
      const isOldData = (date: Date) => {
        const timeToCompare = new Date().getTime() - EVERY_6_HOURS;
        return timeToCompare > date.getTime();
      };

      if (!rate || isOldData(rate?.createAt)) {
        return this.fetchRateAndSave();
      }
      return rate;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async fetchRateAndSave() {
    this.logger.log('fetchRateAndSave');
    try {
      const OPEN_EXCHANGE_API = this.configService.get('OPEN_EXCHANGE_API');
      const url = `htps://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_API}`;
      const { data } = await firstValueFrom(this.httpService.get(url));
      const { VES, COP } = data?.rates;
      return this.create({
        ves: VES,
        cop: COP,
      });
    } catch (error) {
      this.logger.error('fetchRateAndSave: Open Exchange is not available');
    }
  }
}
