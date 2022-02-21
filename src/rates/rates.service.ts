import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRateDto } from './dto/create-rate.dto';
import { Rate } from './entities/rate.entity';
import { RatesRepository } from './rates.repository';

const EVERY_6_HOURS = 1 * 1 * 1 * 60 * 1000;

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
    const isOldData = (date: Date) => {
      const timeToCompare = new Date().getTime() - EVERY_6_HOURS;
      this.logger.debug(
        `timeToCompare: ${timeToCompare}, CreateAt ${date.getTime()}`,
      );
      return timeToCompare > date.getTime();
    };

    if (isOldData(rate.createAt)) {
      return rate;
    }
    return this.fetchRateAndSave();
  }

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
