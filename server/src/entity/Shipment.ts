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
} from "typeorm";

import { Subscription } from "./Subscription";
import { Crystal } from "./Crystal";

@Entity()
export class Shipment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  month: number;

  @Column({ type: "int" })
  year: number;

  @Column({ type: "int", nullable: true })
  cycle: number;

  @Column({ type: "int", nullable: true })
  cycleRangeStart: number;

  @Column({ type: "int", nullable: true })
  cycleRangeEnd: number;

  @Column({ type: "int", nullable: true })
  userCount: number;

  @Column({ type: "boolean", nullable: true })
  userCountIsNew: number;

  @ManyToMany(() => Crystal)
  @JoinTable()
  crystals: Crystal[];

  @ManyToOne(() => Subscription, (subscription) => subscription.shipments)
  subscription: Subscription;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
