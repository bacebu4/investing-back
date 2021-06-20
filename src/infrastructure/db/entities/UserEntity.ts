import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { TickerEntity } from './TickerEntity';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  hashedPassword: string;

  @OneToMany((type) => TickerEntity, (ticker) => ticker.userId)
  tickers: TickerEntity[];
}
