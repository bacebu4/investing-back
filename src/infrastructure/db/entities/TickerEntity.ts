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

  @Column({ type: 'float4' })
  percentageAimingTo: number;

  @ManyToOne(() => UserEntity, (user) => user.tickers)
  userId: UserEntity;

  @OneToOne(() => SymbolEntity)
  @JoinColumn()
  symbol: SymbolEntity;
}
