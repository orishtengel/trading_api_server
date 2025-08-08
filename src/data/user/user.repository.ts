import { IUsersRepository } from './user.repository.interface';
import { UserEntity } from './contracts/user.entities';
import { 
  FindUserByIdRequest, 
  CreateUserRequest, 
  UpdateUserRequest, 
  DeleteUserRequest 
} from './contracts/requestResponse';
import { db } from '@shared/firebase/firebase.config';
import { firestoreDocToEntity, stripIdForFirestore } from '@shared/firebase/firestore.utils';
import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  CollectionReference,
  DocumentReference
} from 'firebase/firestore';

export class UsersRepository implements IUsersRepository {
  private readonly collectionRef = collection(db, 'users');

  async findById(request: FindUserByIdRequest): Promise<UserEntity | null> {
    try {
      const docRef = doc(this.collectionRef, request.id);
      const docSnap = await getDoc(docRef);
      return firestoreDocToEntity<UserEntity>(docSnap);
    } catch (error) {
      console.error('Error finding user by id:', error);
      return null;
    }
  }

  async create(request: CreateUserRequest): Promise<UserEntity> {
    try {
      const now = new Date().toISOString();
      const entityData = {
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        role: request.role,
        permissions: request.permissions,
        created_at: now,
        updated_at: now
      };

      const docRef = await addDoc(this.collectionRef, entityData);
      const docSnap = await getDoc(docRef);
      
      return firestoreDocToEntity<UserEntity>(docSnap)!;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async update(request: UpdateUserRequest): Promise<UserEntity | null> {
    try {
      const docRef = doc(this.collectionRef, request.id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      const updateData: Partial<Omit<UserEntity, 'id' | 'created_at'>> = {
        updated_at: new Date().toISOString()
      };

      if (request.email !== undefined) updateData.email = request.email;
      if (request.firstName !== undefined) updateData.firstName = request.firstName;
      if (request.lastName !== undefined) updateData.lastName = request.lastName;
      if (request.role !== undefined) updateData.role = request.role;
      if (request.permissions !== undefined) updateData.permissions = request.permissions;

      await updateDoc(docRef, updateData);
      
      const updatedDocSnap = await getDoc(docRef);
      return firestoreDocToEntity<UserEntity>(updatedDocSnap);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async delete(request: DeleteUserRequest): Promise<boolean> {
    try {
      const docRef = doc(this.collectionRef, request.id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return false;
      }

      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
} 