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

export class CategoryRepository {
  private categoriesCollection: DocumentReference;

  constructor() {
    this.categoriesCollection = collection(db, 'categories');
  }

  async createCategory(data: any): Promise<DocumentReference> {
    return addDoc(this.categoriesCollection, data);
  }

  async findCategoryById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllCategories(): Promise<any[]> {
    const q = query(this.categoriesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateCategory(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findCategoriesByParentId(parentId: string): Promise<any[]> {
    const q = query(this.categoriesCollection, where('parentId', '==', parentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findCategoryByName(name: string): Promise<QueryDocumentSnapshot | null> {
    const q = query(this.categoriesCollection, where('name', '==', name));
    const snapshot = await getDocs(q);
    return snapshot.size > 0 ? snapshot.docs[0] : null;
  }
}
