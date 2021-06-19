import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity()
export class TickerEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  percentageAimingTo: number;

  @Column()
  symbol: string;

  @ManyToOne((type) => UserEntity, (user) => user.tickers)
  userId: UserEntity;
}
