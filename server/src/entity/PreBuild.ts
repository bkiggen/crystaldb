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
export class PreBuild extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: true })
  cycle: number;

  @Column({ type: "int", nullable: true })
  cycleRangeStart: number;

  @Column({ type: "int", nullable: true })
  cycleRangeEnd: number;

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
