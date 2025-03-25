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

  @Column({ nullable: true })
  cycle: string;

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
