import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
// import { User } from "./User";
import { Crystal } from "./Crystal";

@Entity()
export class Shipment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: "date", nullable: true })
  // shippedOn: Date;

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

  // @ManyToMany(() => User)
  // @JoinTable()
  // users: User[];

  @ManyToMany(() => Crystal)
  @JoinTable()
  crystals: Crystal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
