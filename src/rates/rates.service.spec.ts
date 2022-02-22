import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { RatesRepository } from './rates.repository';
import { RatesService } from './rates.service';

const mockRatesRepository = () => ({
  findLast: jest.fn(),
  createRate: jest.fn(),
});
const mockHttpService = () => ({
  get: jest.fn(),
});
const mockConfigService = () => ({
  get: jest.fn(),
});

describe('RatesService', () => {
  let ratesService: RatesService;
  let ratesRepository: RatesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatesService,
        {
          provide: HttpService,
          useFactory: mockHttpService,
        },
        { provide: RatesRepository, useFactory: mockRatesRepository },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    ratesService = module.get<RatesService>(RatesService);
    ratesRepository = module.get<RatesRepository>(RatesRepository);
  });

  describe('findLast', () => {
    it('calls to RatesService.findLast and return the result', () => {
      expect(ratesRepository.findLast).not.toHaveBeenCalled();
      ratesService.findLast();
      expect(ratesRepository.findLast).toHaveBeenCalled();
    });
  });
});
