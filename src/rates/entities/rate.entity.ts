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
  cop: string;

  @Column()
  ves: string;

  @CreateDateColumn()
  createAt: Date;
}
