import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { DocumentEntity } from './document.entity';


@Entity('analysis')
export class AnalysisEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column({ type: 'jsonb'})
  result: any;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => DocumentEntity, doc => doc.analysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  document: DocumentEntity;

  @ManyToOne(() => UserEntity, user => user.analysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

}