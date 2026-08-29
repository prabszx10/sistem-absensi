import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nama: string;

  @Column({ unique: true })
  email: string;

  @Column()
  posisi: string;

  @Column()
  phoneNo: string;

  @Column({ nullable: true })
  photo: string;
  
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  createdBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @Column()
  updatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}