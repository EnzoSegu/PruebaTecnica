import { Module } from '@nestjs/common';
import { LeadsModule } from './leads/leads.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-1-us-east-1.pooler.supabase.com', // Por ejemplo: 'db.xyz.supabase.co'
      port: 6543,
      username: 'postgres.nghcatafncjfdzucyiiz', // Usuario de la base de datos
      password: 'lp9jq12pm18', // Contraseña de la base de datos
      database: 'postgres', // Nombre de la base de datos

      // Importante: lista todas tus entidades (modelos de datos) aquí
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // Si usas migraciones, configúralas aquí
      synchronize: true, // ¡ATENCIÓN! Usar 'true' solo en desarrollo. En producción, usar migraciones.
      ssl: { rejectUnauthorized: false }, // IMPORTANTE: Supabase suele requerir conexión SSL
    }),
    LeadsModule,
  ],
})
export class AppModule {}
