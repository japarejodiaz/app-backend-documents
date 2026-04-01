import {
  Column,
  CreateDateColumn, Entity,
  OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { AnalysisEntity } from './analysis.entity';
import { DocumentEntity } from './document.entity';


@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => DocumentEntity, doc => doc.user)
  documents: DocumentEntity[];

  @OneToMany(() => AnalysisEntity, analysis => analysis.user)
  analysis: AnalysisEntity[];

}
