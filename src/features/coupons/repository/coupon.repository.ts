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

export class CouponRepository {
  private couponsCollection: DocumentReference;

  constructor() {
    this.couponsCollection = collection(db, 'coupons');
  }

  async createCoupon(data: any): Promise<DocumentReference> {
    return addDoc(this.couponsCollection, data);
  }

  async findCouponById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'coupons', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllCoupons(): Promise<any[]> {
    const q = query(this.couponsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateCoupon(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'coupons', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    const docRef = doc(db, 'coupons', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findCouponsByCode(code: string): Promise<QueryDocumentSnapshot | null> {
    const q = query(this.couponsCollection, where('code', '==', code));
    const snapshot = await getDocs(q);
    return snapshot.size > 0 ? snapshot.docs[0] : null;
  }

  async findActiveCoupons(): Promise<any[]> {
    const q = query(
      this.couponsCollection, 
      where('isActive', '==', true),
      orderBy('expiresAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
