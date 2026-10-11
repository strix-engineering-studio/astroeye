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

export class ProductRepository {
  private productsCollection: DocumentReference;

  constructor() {
    this.productsCollection = collection(db, 'products');
  }

  async createProduct(data: any): Promise<DocumentReference> {
    return addDoc(this.productsCollection, data);
  }

  async findProductById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllProducts(): Promise<any[]> {
    const q = query(this.productsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateProduct(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findProductsByCategoryId(categoryId: string): Promise<any[]> {
    const q = query(this.productsCollection, where('categoryId', '==', categoryId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findProductByName(name: string): Promise<QueryDocumentSnapshot | null> {
    const q = query(this.productsCollection, where('name', '==', name));
    const snapshot = await getDocs(q);
    return snapshot.size > 0 ? snapshot.docs[0] : null;
  }

  async searchProducts(query: string): Promise<any[]> {
    // Firestore doesn't support text search directly, so we'll do a simple case-insensitive match
    const lowerQuery = query.toLowerCase();
    
    const q = query(this.productsCollection);
    const snapshot = await getDocs(q);
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(product => 
        product.name?.toLowerCase().includes(lowerQuery) ||
        (product.description && product.description.toLowerCase().includes(lowerQuery))
      );
  }
}
