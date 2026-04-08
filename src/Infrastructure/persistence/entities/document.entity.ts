import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AnalysisEntity } from './analysis.entity';
import { UserEntity } from './user.entity';

@Entity('documents')
export class DocumentEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  storagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, user => user.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => AnalysisEntity, analysis => analysis.document)
  analysis: AnalysisEntity[];

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'PENDING',
  })
  status: 'PENDING' | 'OK' | 'NOK';

}