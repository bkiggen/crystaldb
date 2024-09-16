import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Subscription } from './Subscription'
import { Crystal } from './Crystal'

@Entity()
export class Shipment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  month: number

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'int', nullable: true })
  cycle: number

  @Column({ type: 'int', nullable: true })
  userCount: number

  @Column({ nullable: true })
  groupLabel: string

  @Column({ type: 'boolean', nullable: true })
  userCountIsNew: boolean

  @ManyToMany(() => Crystal, crystal => crystal.shipments)
  @JoinTable() // JoinTable only on the owning side
  crystals: Crystal[]

  @ManyToOne(() => Subscription, subscription => subscription.shipments)
  subscription: Subscription

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
