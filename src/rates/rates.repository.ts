import { CreateRateDto } from './dto/create-rate.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Rate } from './entities/rate.entity';

@EntityRepository(Rate)
export class RatesRepository extends Repository<Rate> {
  async findLast(): Promise<Rate> {
    const rate = this.findOne({ order: { createAt: 'DESC' } });
    return rate;
  }
  async createRate(createRateDto: CreateRateDto): Promise<Rate> {
    const rate = this.create(createRateDto);
    await this.save(rate);
    return rate;
  }
}
