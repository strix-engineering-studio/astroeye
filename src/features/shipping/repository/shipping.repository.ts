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

export class ShippingRepository {
  private shipplingsCollection: DocumentReference;

  constructor() {
    this.shipplingsCollection = collection(db, 'shipplings');
  }

  async createShipping(data: any): Promise<DocumentReference> {
    return addDoc(this.shipplingsCollection, data);
  }

  async findShippingById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'shipplings', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllShipplings(): Promise<any[]> {
    const q = query(this.shipplingsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateShipping(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'shipplings', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteShipping(id: string): Promise<boolean> {
    const docRef = doc(db, 'shipplings', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findShipplingsByOrderId(orderId: string): Promise<any[]> {
    const q = query(this.shipplingsCollection, where('orderId', '==', orderId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findShippingByAddressId(addressId: string): Promise<QueryDocumentSnapshot | null> {
    const q = query(this.shipplingsCollection, where('addressId', '==', addressId));
    const snapshot = await getDocs(q);
    return snapshot.size > 0 ? snapshot.docs[0] : null;
  }

  async calculateShippingCost(orderData: any): Promise<number> {
    // TODO: Implement shipping cost calculation logic based on order data
    // This is a placeholder - you may want to create a separate service for this
    const baseRate = 5.0;
    const weightFactor = (orderData.weight || 1) * 2;
    
    return Math.round(baseRate + weightFactor);
  }
}
