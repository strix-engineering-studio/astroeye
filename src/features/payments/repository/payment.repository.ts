import { db } from '@/lib/firebase.config';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentReference,
  QueryDocumentSnapshot
} from 'firebase/firestore';

export class PaymentRepository {
  private paymentsCollection: DocumentReference;

  constructor() {
    this.paymentsCollection = collection(db, 'payments');
  }

  async createPayment(data: any): Promise<DocumentReference> {
    return addDoc(this.paymentsCollection, data);
  }

  async findPaymentById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'payments', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllPayments(): Promise<any[]> {
    const q = query(this.paymentsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updatePayment(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'payments', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deletePayment(id: string): Promise<boolean> {
    const docRef = doc(db, 'payments', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findPaymentsByOrder(orderId: string): Promise<any[]> {
    const q = query(this.paymentsCollection, where('orderId', '==', orderId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findPaymentByTransactionId(transactionId: string): Promise<QueryDocumentSnapshot | null> {
    const q = query(this.paymentsCollection, where('transactionId', '==', transactionId));
    const snapshot = await getDocs(q);
    return snapshot.size > 0 ? snapshot.docs[0] : null;
  }
}
