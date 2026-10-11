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

export class CartRepository {
  private cartsCollection: DocumentReference;

  constructor() {
    this.cartsCollection = collection(db, 'carts');
  }

  async createCart(data: any): Promise<DocumentReference> {
    return addDoc(this.cartsCollection, data);
  }

  async findCartById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'carts', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllCarts(): Promise<any[]> {
    const q = query(this.cartsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateCart(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'carts', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteCart(id: string): Promise<boolean> {
    const docRef = doc(db, 'carts', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findCartsByUserId(userId: string): Promise<any[]> {
    const q = query(this.cartsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addToCart(cartId: string, productId: string, quantity: number): Promise<boolean> {
    const cartRef = doc(db, 'carts', cartId);
    const cartSnap = await getDoc(cartRef);
    
    if (!cartSnap.exists()) return false;
    
    const cartData = cartSnap.data();
    let items = [...(cartData.items || [])];
    
    const existingItemIndex = items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      items[existingItemIndex].quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }
    
    await updateDoc(cartRef, { items });
    return true;
  }

  async removeFromCart(cartId: string, productId: string): Promise<boolean> {
    const cartRef = doc(db, 'carts', cartId);
    const cartSnap = await getDoc(cartRef);
    
    if (!cartSnap.exists()) return false;
    
    const cartData = cartSnap.data();
    let items = [...(cartData.items || [])];
    
    const itemIndex = items.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      items.splice(itemIndex, 1);
    }
    
    await updateDoc(cartRef, { items });
    return true;
  }
}
