import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class SymbolEntity {
  @PrimaryColumn()
  symbol: string;

  @Column()
  name: string;
}
