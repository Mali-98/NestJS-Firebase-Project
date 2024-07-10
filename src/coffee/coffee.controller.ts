import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CoffeeService } from './coffee.service';

@Controller()
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) {}

  @Patch(':collection/:documentId')
  async updateDocument(
    @Param('collection') collection: string,
    @Param('documentId') documentId: string,
    @Body() body: any,
  ) {
    try {
      if (!body || Object.keys(body).length === 0) {
        throw new Error('Empty request body');
      }

      await this.coffeeService.updateDocument(collection, documentId, body);

      return { message: 'Document updated successfully' };
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('An error occurred while updating the document');
    }
  }

  @Get(':collection/:documentId')
  async getDocument(
    @Param('collection') collection: string,
    @Param('documentId') documentId: string,
    @Query('fields') fields?: string,
  ) {
    try {
      const document = await this.coffeeService.getDocument(collection, documentId, fields);  
      if (!document) {
        return 'Document not found.';
      }
      return document;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw new Error('Internal server error.');
    }
  }

  @Get(':collection/:documentId/score')
  async getExerciseScore(@Param('documentId') documentId: string, 
  @Param('collection') collection: string) {
    try {
      const field1 = 'q1';
      const field2 = 'q2';
      const field3 = 'q3';
      let showBadge = false;

      const document = await this.coffeeService.getDocument(collection, documentId);
      if (!document) {
        return 'Document not found.';
      }

      const score = document[field1] + document[field2] + document[field3];
      if (score>=8)
      {
        showBadge = true;
      }

      return { score, showBadge };
    } catch (error) {
      console.error('Error fetching exercise score:', error);
      throw new Error('Internal server error.');
    }
  }

  @Patch(':collection/:documentId/steps')
  async updateSteps(
    @Param('collection') collection: string,
    @Param('documentId') documentId: string,
    @Body() body: any,
  ) {
    const steps = body as any[]; // Assuming the body is an array of Step objects

      // Process and store the steps using the coffeeService
      await this.coffeeService.processSteps(collection, documentId, steps);

      return 'Steps updated successfully';
    } catch (error) {
      // Handle the error appropriately
      throw new Error('Failed to update steps');
    }
  
    @Get('/:collection/:documentId/steps')
    async getSteps(
      @Param('collection') collection: string,
      @Param('documentId') documentId: string,
    ) {
      try {
        const steps = await this.coffeeService.getSteps(collection, documentId);
        if (!steps) {
          return 'Document not found.';
        }
        return steps;
      } catch (error) {
        console.error('Error fetching document:', error);
        throw new Error('Internal server error.');
      }
    }
}