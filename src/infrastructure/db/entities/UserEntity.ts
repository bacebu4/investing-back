import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Currency } from '../../../domain/User/User';
import { TickerEntity } from './TickerEntity';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @Column()
  currency: Currency;

  @OneToMany(() => TickerEntity, (ticker) => ticker.userId)
  tickers: TickerEntity[];
}
