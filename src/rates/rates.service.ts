import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
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
    this.create({
      ves: VES,
      cop: COP,
    });
  }
}
