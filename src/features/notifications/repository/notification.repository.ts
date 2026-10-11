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

export class NotificationRepository {
  private notificationsCollection: DocumentReference;

  constructor() {
    this.notificationsCollection = collection(db, 'notifications');
  }

  async createNotification(data: any): Promise<DocumentReference> {
    return addDoc(this.notificationsCollection, data);
  }

  async findNotificationById(id: string): Promise<QueryDocumentSnapshot | null> {
    const docRef = doc(db, 'notifications', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap : null;
  }

  async findAllNotifications(): Promise<any[]> {
    const q = query(this.notificationsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateNotification(id: string, data: any): Promise<boolean> {
    const docRef = doc(db, 'notifications', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await updateDoc(docRef, data);
    return true;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const docRef = doc(db, 'notifications', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    
    await deleteDoc(docRef);
    return true;
  }

  async findNotificationsByUserId(userId: string): Promise<any[]> {
    const q = query(this.notificationsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findUnreadNotifications(userId: string): Promise<any[]> {
    const q = query(
      this.notificationsCollection, 
      where('userId', '==', userId),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const notificationRef = doc(db, 'notifications', notificationId);
    const notificationSnap = await getDoc(notificationRef);
    
    if (!notificationSnap.exists()) return false;
    
    await updateDoc(notificationRef, { isRead: true });
    return true;
  }
}
