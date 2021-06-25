import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SymbolEntity } from './SymbolEntity';
import { UserEntity } from './UserEntity';

@Entity()
export class TickerEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  amount: number;

  @Column()
  percentageAimingTo: number;

  @ManyToOne((type) => UserEntity, (user) => user.tickers)
  userId: UserEntity;

  @OneToOne((type) => SymbolEntity)
  @JoinColumn()
  symbol: SymbolEntity;
}
