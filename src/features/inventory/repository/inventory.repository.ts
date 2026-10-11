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

export class InventoryRepository {
  private inventoriesCollection: DocumentReference;

  constructor() {
    this.inventoriesCollection = collection(db, 'inventories');
  }

  async createInventory(data: any): Promise<DocumentReference> {
    return addDoc(this.inventoriesCollection, data);
  }

  async findInventoryById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'inventories', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllInventories(): Promise<any[]> {
    const q = query(this.inventoriesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateInventory(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'inventories', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteInventory(id: string): Promise<boolean> {
    const docRef = doc(db, 'inventories', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findInventoriesByProductId(productId: string): Promise<any[]> {
    const q = query(this.inventoriesCollection, where('productId', '==', productId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateInventoryQuantity(productId: string, quantityChange: number): Promise<boolean> {
    const q = query(this.inventoriesCollection, where('productId', '==', productId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return false;
    
    const docRef = doc(db, 'inventories', snapshot.docs[0].id);
    const inventoryData = snapshot.docs[0].data();
    
    let newQuantity = inventoryData.quantity + quantityChange;
    
    await updateDoc(docRef, { 
      quantity: newQuantity,
      updatedAt: new Date()
    });
    
    return true;
  }

  async findLowStockInventories(threshold: number): Promise<any[]> {
    const q = query(this.inventoriesCollection, where('quantity', '<=', threshold));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
