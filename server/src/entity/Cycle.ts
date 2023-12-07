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
export class Cycle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date", nullable: true })
  shippedOn: Date;

  @Column({ type: "int" })
  month: number;

  @Column({ type: "int" })
  week: number;

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
