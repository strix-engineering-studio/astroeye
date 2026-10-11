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

export class ReviewRepository {
  private reviewsCollection: DocumentReference;

  constructor() {
    this.reviewsCollection = collection(db, 'reviews');
  }

  async createReview(data: any): Promise<DocumentReference> {
    return addDoc(this.reviewsCollection, data);
  }

  async findReviewById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'reviews', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllReviews(): Promise<any[]> {
    const q = query(this.reviewsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateReview(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'reviews', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteReview(id: string): Promise<boolean> {
    const docRef = doc(db, 'reviews', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findReviewsByProductId(productId: string): Promise<any[]> {
    const q = query(this.reviewsCollection, where('productId', '==', productId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findAverageRatingByProduct(productId: string): Promise<number | null> {
    const q = query(this.reviewsCollection, where('productId', '==', productId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    let totalRating = 0;
    const count = snapshot.size;
    
    for (const doc of snapshot.docs) {
      totalRating += doc.data().rating || 0;
    }
    
    return count > 0 ? Math.round(totalRating / count) : null;
  }

  async findReviewsByRating(rating: number): Promise<any[]> {
    const q = query(this.reviewsCollection, where('rating', '==', rating));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
