import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert('E:/Work/NestJS FireBase/coffee-app/src/firestore/creds.json'),
  });

@Injectable()
export class FirestoreService {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  updateDocument(collection: string, documentId: string, data: any) {
    const docRef = this.db.collection(collection).doc(documentId);
    return docRef.update(data);
  }

  getDocument(collection: string, documentId: string, fields?: string) {
    const docRef = this.db.collection(collection).doc(documentId);

    return docRef.get().then((doc) => {
      if (!doc.exists) {
        return null;
      }

      if (!fields) {
        return doc.data();
      }

      const requestedFields = fields.split('.');
      let fieldValue = doc.data();
      for (const field of requestedFields) {
        if (!fieldValue.hasOwnProperty(field)) {
          throw new Error(`Invalid field '${field}' or field not found.`);
        }
        fieldValue = fieldValue[field];
      }

      return fieldValue;
    });
  }
}