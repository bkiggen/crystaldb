import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @Column()
  // color: string;

  // @Column()
  // should reference other table
  // category: string;

  @CreateDateColumn()
  createdAt: Date;
}
