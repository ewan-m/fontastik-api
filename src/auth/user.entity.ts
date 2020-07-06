import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar")
	name: string;

	@Column("varchar(320)")
	email: string;

	@Column("varchar", { select: false })
	passwordHash: string;

	@Column("varchar", { select: false })
	passwordSalt: string;

	@Column("boolean", { default: 1 })
	isActive: boolean;
}
