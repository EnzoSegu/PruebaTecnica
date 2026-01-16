import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('leads') // Especifica el nombre de la tabla en PostgreSQL
export class Lead {
  @PrimaryGeneratedColumn()
  id: number; // ID único auto-generado

  // Campo para la deduplicación y tracking de Leads sincronizados
  @Column({ unique: true, nullable: true })
  externalId: string;

  @Column()
  name: string;

  // Email como clave potencial para deduplicación, debe ser único si existe
  @Column({ unique: true })
  email: string;

  // Fuente: 'Manual' o 'Sincronizado'
  @Column({ default: 'Manual' })
  source: string;

  // Campo requerido para la IA
  @Column({ type: 'text', nullable: true })
  summary: string;

  // Campo requerido para la IA
  @Column({ nullable: true })
  nextAction: string;

  // Timestamps automáticos
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
