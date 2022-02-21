import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRateDto } from './dto/create-rate.dto';
import { Rate } from './entities/rate.entity';
import { RatesRepository } from './rates.repository';

const isOldData = (date: Date) => {
  const timeToCompare = new Date().getTime() + 1 * 1 * 5 * 60 * 1000;
  return timeToCompare > date.getTime();
};

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
    const rate = await this.ratesRepository.findLast();
    this.logger.debug(JSON.stringify(rate));
    if (isOldData(rate.createAt)) {
      return rate;
    }
    return this.fetchRateAndSave();
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async fetchRateAndSave() {
    this.logger.log('fetchRateAndSave');
    const OPEN_EXCHANCE_API = this.configService.get('OPEN_EXCHANCE_API');
    const response = await this.httpService
      .get(
        `htps://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANCE_API}`,
      )
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    const { VES, COP } = response.data.rates;
    return this.create({
      ves: VES,
      cop: COP,
    });
  }
}
