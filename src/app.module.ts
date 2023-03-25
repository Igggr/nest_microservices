import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: '123456',
      database: 'test',
      entities: [],
      synchronize: true,  // автоматические миграции
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
