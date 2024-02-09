import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Shipment } from "./Shipment";

@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column({ type: "int", nullable: true })
  cost: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Shipment, (shipment) => shipment.subscription)
  shipments: Shipment[];

  @UpdateDateColumn()
  updatedAt: Date;
}
