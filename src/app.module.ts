import { Module } from '@nestjs/common';
import { CoffeeModule } from './coffee/coffee.module';
import { FirestoreService } from './firestore/firestore.service';
import { CoffeeService } from './coffee/coffee.service';

@Module({
  imports: [CoffeeModule],
  controllers: [],
  providers: [FirestoreService, CoffeeService],
})
export class AppModule {}