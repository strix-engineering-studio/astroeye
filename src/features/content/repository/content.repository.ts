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

export class ContentRepository {
  private contentsCollection: DocumentReference;

  constructor() {
    this.contentsCollection = collection(db, 'contents');
  }

  async createContent(data: any): Promise<DocumentReference> {
    return addDoc(this.contentsCollection, data);
  }

  async findContentById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'contents', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllContents(): Promise<any[]> {
    const q = query(this.contentsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateContent(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'contents', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteContent(id: string): Promise<boolean> {
    const docRef = doc(db, 'contents', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findContentsByType(type: string): Promise<any[]> {
    const q = query(this.contentsCollection, where('type', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findContentBySlug(slug: string): Promise<QueryDocumentSnapshot | null> {
    const q = query(this.contentsCollection, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    return snapshot.size > 0 ? snapshot.docs[0] : null;
  }
}
