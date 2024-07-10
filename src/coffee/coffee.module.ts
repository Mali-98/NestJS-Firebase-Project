import { FirestoreService } from '../firestore/firestore.service';
import { Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';

@Module({
  controllers: [CoffeeController],
  providers: [FirestoreService, CoffeeService]
})
export class CoffeeModule {}
