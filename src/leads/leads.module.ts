import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity'; // Asegúrate de que esta ruta sea correcta

@Module({
  imports: [
    // Esto pone el Repositorio de Lead a disposición para inyección en LeadsService
    TypeOrmModule.forFeature([Lead]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  // Exporta el servicio si otros módulos lo necesitan
  exports: [LeadsService],
})
export class LeadsModule {}
