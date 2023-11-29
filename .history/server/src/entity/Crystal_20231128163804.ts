import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
import { Color } from "./Color";

enum Rarity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

enum FindAge {
  NEW = "NEW",
  OLD = "OLD",
  DEAD = "DEAD",
}

@Entity()
export class Crystal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Color, { eager: true, nullable: true })
  color: Color;

  @Column()
  category: string;

  @Column({
    type: "enum",
    enum: Rarity,
    default: Rarity.LOW,
  })
  rarity: Rarity;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({
    type: "enum",
    enum: FindAge,
    default: FindAge.NEW,
  })
  findAge: FindAge;

  @CreateDateColumn()
  createdAt: Date;
}
