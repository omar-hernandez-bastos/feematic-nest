import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRateDto } from './dto/create-rate.dto';
import { Rate } from './entities/rate.entity';
import { RatesRepository } from './rates.repository';

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);
  constructor(
    private httpService: HttpService,
    @InjectRepository(RatesRepository) private ratesRepository: RatesRepository,
  ) {}
  create(createRateDto: CreateRateDto) {
    return this.ratesRepository.createRate(createRateDto);
  }

  findLast(): Promise<Rate> {
    return this.ratesRepository.findLast();
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async fetchRateAndSave() {
    this.logger.log('fetchRateAndSave');
    const response = await this.httpService
      .get(
        'htps://openexchangerates.org/api/latest.json?app_id=5fe7bbbc6f2f4500a692a133235cdd88',
      )
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    const { VES, COP } = response.data.rates;
    this.create({
      ves: VES,
      cop: COP,
    });
  }
}
