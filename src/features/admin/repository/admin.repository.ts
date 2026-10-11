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

export class AdminRepository {
  private adminsCollection: DocumentReference;

  constructor() {
    this.adminsCollection = collection(db, 'admins');
  }

  async createAdmin(data: any): Promise<DocumentReference> {
    return addDoc(this.adminsCollection, data);
  }

  async findAdminById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'admins', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllAdmins(): Promise<any[]> {
    const q = query(this.adminsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateAdmin(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'admins', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const docRef = doc(db, 'admins', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findAdminsByRole(role: string): Promise<any[]> {
    const q = query(this.adminsCollection, where('role', '==', role));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
