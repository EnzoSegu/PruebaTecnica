import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';

import { HttpService } from '@nestjs/axios'; // Agrega HttpService
import { Cron } from '@nestjs/schedule'; // Agrega Cron
import { firstValueFrom } from 'rxjs';

// Define qué forma tiene el usuario que viene de la API externa
interface RandomUser {
  name: { first: string; last: string };
  email: string;
  login: { uuid: string };
}

// Define qué forma tiene la respuesta completa de la API
interface RandomUserResponse {
  results: RandomUser[];
}
@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name); // Para logs claros (requisito PDF)
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    private readonly httpService: HttpService, // <--- Inyectamos el servicio HTTP
  ) {}

  // 1. Crear un lead manualmente
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Verificar si ya existe el email (requisito implícito de unicidad)
    const existing = await this.leadsRepository.findOne({
      where: { email: createLeadDto.email },
    });
    if (existing) {
      throw new ConflictException('El lead con este email ya existe');
    }

    const newLead = this.leadsRepository.create({
      ...createLeadDto,
      source: 'Manual', // Forzamos que sea manual si entra por aquí
    });
    return this.leadsRepository.save(newLead);
  }

  // 2. Listar leads
  async findAll(): Promise<Lead[]> {
    return this.leadsRepository.find();
  }

  async findOne(id: number): Promise<Lead> {
    const lead = await this.leadsRepository.findOneBy({ id });
    if (!lead) {
      throw new NotFoundException(`No se encontró el lead con ID ${id}`);
    }
    return lead;
  }
  @Cron('*/10 * * * * *') // Recuerda cambiar esto según tu prueba (10 seg o 10 min)
  async handleCron() {
    this.logger.debug('Iniciando sincronización de leads...');

    try {
      // 1. Consultar API externa (Tipando la respuesta)
      // Al poner <RandomUserResponse>, TypeScript ya sabe qué esperar y deja de quejarse
      const { data } = await firstValueFrom(
        this.httpService.get<RandomUserResponse>(
          'https://randomuser.me/api/?results=10',
        ),
      );

      const externalUsers = data.results;
      let nuevosGuardados = 0;

      // 2. Procesar cada usuario
      for (const user of externalUsers) {
        // Ahora TypeScript sabe que 'user' tiene email, name, etc. ¡Autocompletado gratis!
        const email = user.email;

        // 3. Estrategia de Deduplicación
        const existe = await this.leadsRepository.findOneBy({ email });

        if (!existe) {
          const newLead = this.leadsRepository.create({
            name: `${user.name.first} ${user.name.last}`,
            email: email,
            source: 'Sincronizado',
            externalId: user.login.uuid,
            createdAt: new Date(),
          });

          await this.leadsRepository.save(newLead);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          nuevosGuardados++;
        }
      }

      this.logger.debug(
        ' Sincronización finalizada. Nuevos leads: ${nuevosGuardados} ',
      );
    } catch (error) {
      this.logger.error('Error en la sincronización CRON', error);
    }
  }
}
