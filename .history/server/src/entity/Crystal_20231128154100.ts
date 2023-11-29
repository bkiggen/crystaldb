import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
import { Color } from "./Color";

enum Rarity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

enum FindAge {
  NEW = "new",
  OLD = "old",
  DEAD = "dead",
}

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Color, { eager: true }) // Define ManyToOne relationship
  color: Color; // Reference to the Color entity

  @Column()
  category: string;

  @Column({
    type: "enum",
    enum: Rarity,
    default: Rarity.LOW, // Set the default value to "low"
  })
  rarity: Rarity;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({
    type: "enum",
    enum: FindAge,
    default: FindAge.NEW, // Set the default value to "new"
  })
  findAge: FindAge;

  @CreateDateColumn()
  createdAt: Date;
}
