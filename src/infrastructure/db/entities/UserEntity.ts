import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
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
  currency: string;

  @OneToMany((type) => TickerEntity, (ticker) => ticker.userId)
  tickers: TickerEntity[];
}
