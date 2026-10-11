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
  QueryDocumentSnapshot,
  QueryDocumentSnapshot as DocumentSnapshot
} from 'firebase/firestore';

export class AddressRepository {
  private addressesCollection: DocumentReference;

  constructor() {
    this.addressesCollection = collection(db, 'addresses');
  }

  async createAddress(data: any): Promise<DocumentReference> {
    return addDoc(this.addressesCollection, data);
  }

  async findAddressById(id: string): Promise<DocumentSnapshot | null> {
    const docRef = doc(db, 'addresses', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllAddresses(): Promise<any[]> {
    const q = query(this.addressesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateAddress(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'addresses', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteAddress(id: string): Promise<boolean> {
    const docRef = doc(db, 'addresses', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findAddressesByCustomerId(customerId: string): Promise<any[]> {
    const q = query(
      this.addressesCollection, 
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findDefaultAddress(userId: string): Promise<DocumentSnapshot | null> {
    const q = query(
      this.addressesCollection, 
      where('userId', '==', userId),
      where('isDefault', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.size > 0 ? snapshot.docs[0] : null;
  }
}
