import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cop: number;

  @Column()
  ves: number;

  @CreateDateColumn()
  createAt: Date;
}
