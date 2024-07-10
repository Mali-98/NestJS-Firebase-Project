import { Injectable } from '@nestjs/common';
import { FirestoreService } from 'src/firestore/firestore.service';
import * as admin from 'firebase-admin';

@Injectable()
export class CoffeeService {
  constructor(private readonly firestoreService: FirestoreService) {}

  async updateDocument(collection: string, documentId: string, data: any) {
    return this.firestoreService.updateDocument(collection, documentId, data);
  }

  async getDocument(collection: string, documentId: string, fields?: string) {
    return this.firestoreService.getDocument(collection, documentId, fields);
  }

  async processSteps(collection: string, documentId: string, steps: any[]): Promise<void> {
    const db = admin.firestore();

    // Save each step to the subcollection
    await Promise.all(steps.map(async (step) => {
      const subcollectionRef = db.collection(collection).doc(documentId).collection('steps');
      const stepId = step.id;

      // Check if the step document already exists
      const stepDoc = await subcollectionRef.doc(stepId).get();
      
      if (stepDoc.exists) {
        // Update existing document
        await subcollectionRef.doc(stepId).update(step);
        console.log(`Updated document: ${stepId}`);
      } else {
        // Create new document
        await subcollectionRef.doc(stepId).set(step);
        console.log(`Created document: ${stepId}`);
      }
    }));

    console.log('Steps updated successfully!');
  } catch (error) {
    console.error('Failed to update steps:', error);
    throw new Error('Failed to update steps');
  }

  async getSteps(collection: string, documentId: string): Promise<any[]> {
    const db = admin.firestore();
    const stepsRef = db.collection(collection).doc(documentId).collection('steps');

    const snapshot = await stepsRef.get();

    return snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
  }
}