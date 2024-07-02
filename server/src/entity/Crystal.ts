import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm'
import { Color } from './Color'
import { Category } from './Category'
import { Location } from './Location'
import { Shipment } from './Shipment' // Import Shipment entity

export enum Rarity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum FindAge {
  NEW = 'NEW',
  OLD = 'OLD',
  DEAD = 'DEAD',
}

export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

export enum Inventory {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  OUT = 'OUT',
}

@Entity()
export class Crystal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Color, { eager: true, nullable: true, onDelete: 'SET NULL' })
  color: Color

  @ManyToOne(() => Category, category => category.crystals, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category

  @ManyToOne(() => Location, location => location.crystals, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  location: Location

  @Column({
    type: 'enum',
    enum: Rarity,
    nullable: true,
  })
  rarity: Rarity

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  image: string

  @Column({
    type: 'enum',
    enum: FindAge,
    nullable: true,
  })
  findAge: FindAge

  @Column({
    type: 'enum',
    enum: Size,
    nullable: true,
  })
  size: Size

  @Column({
    type: 'enum',
    enum: Inventory,
    default: Inventory.MEDIUM,
    nullable: true,
  })
  inventory: Inventory

  @CreateDateColumn()
  createdAt: Date

  @ManyToMany(() => Shipment, shipment => shipment.crystals)
  shipments: Shipment[]
}
