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

export class CollectionRepository {
  private collectionsCollection: DocumentReference;

  constructor() {
    this.collectionsCollection = collection(db, 'collections');
  }

  async createCollection(data: any): Promise<DocumentReference> {
    return addDoc(this.collectionsCollection, data);
  }

  async findCollectionById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'collections', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllCollections(): Promise<any[]> {
    const q = query(this.collectionsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateCollection(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'collections', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteCollection(id: string): Promise<boolean> {
    const docRef = doc(db, 'collections', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findCollectionsByUserId(userId: string): Promise<any[]> {
    const q = query(this.collectionsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addProductToCollection(collectionId: string, productId: string): Promise<boolean> {
    const collectionRef = doc(db, 'collections', collectionId);
    const collectionSnap = await getDoc(collectionRef);
    
    if (!collectionSnap.exists()) return false;
    
    const collectionData = collectionSnap.data();
    let products = [...(collectionData.products || [])];
    
    const existingProductIndex = products.findIndex(item => item.productId === productId);
    
    if (existingProductIndex >= 0) {
      products[existingProductIndex].quantity += 1;
    } else {
      products.push({ productId, quantity: 1 });
    }
    
    await updateDoc(collectionRef, { products });
    return true;
  }

  async removeProductFromCollection(collectionId: string, productId: string): Promise<boolean> {
    const collectionRef = doc(db, 'collections', collectionId);
    const collectionSnap = await getDoc(collectionRef);
    
    if (!collectionSnap.exists()) return false;
    
    const collectionData = collectionSnap.data();
    let products = [...(collectionData.products || [])];
    
    const productIndex = products.findIndex(item => item.productId === productId);
    
    if (productIndex >= 0) {
      products.splice(productIndex, 1);
    }
    
    await updateDoc(collectionRef, { products });
    return true;
  }
}
