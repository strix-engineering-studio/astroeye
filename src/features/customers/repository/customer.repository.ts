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

export class CustomerRepository {
  private customersCollection: DocumentReference;

  constructor() {
    this.customersCollection = collection(db, 'customers');
  }

  async createCustomer(data: any): Promise<DocumentReference> {
    return addDoc(this.customersCollection, data);
  }

  async findCustomerById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'customers', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllCustomers(): Promise<any[]> {
    const q = query(this.customersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateCustomer(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'customers', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const docRef = doc(db, 'customers', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findCustomersByEmail(email: string): Promise<QueryDocumentSnapshot | null> {
    const q = query(this.customersCollection, where('email', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.size > 0 ? snapshot.docs[0] : null;
  }

  async findCustomersByStatus(status: string): Promise<any[]> {
    const q = query(this.customersCollection, where('status', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
