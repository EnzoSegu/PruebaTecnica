import { Module } from '@nestjs/common';
import { LeadsModule } from './leads/leads.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'TU_HOST_SUPABASE', // Por ejemplo: 'db.xyz.supabase.co'
      port: 5432,
      username: 'TU_USUARIO', // Usuario de la base de datos
      password: 'TU_PASSWORD', // Contraseña de la base de datos
      database: 'NOMBRE_DE_TU_DB', // Nombre de la base de datos

      // Importante: lista todas tus entidades (modelos de datos) aquí
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // Si usas migraciones, configúralas aquí
      synchronize: true, // ¡ATENCIÓN! Usar 'true' solo en desarrollo. En producción, usar migraciones.
    }),
    LeadsModule,
  ],
})
export class AppModule {}
