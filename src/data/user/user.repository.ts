import { IUsersRepository } from './user.repository.interface';
import { UserEntity } from './contracts/user.entities';
import { 
  FindUserByIdRequest, 
  CreateUserRequest, 
  UpdateUserRequest, 
  DeleteUserRequest   
} from './contracts/requestResponse';
import { db } from '@shared/firebase/firebase.admin.config';
import { firestoreDocToEntity } from '@shared/firebase/firestore.utils';

export class UsersRepository implements IUsersRepository {
  private readonly collection = db.collection('users');

  async findById(request: FindUserByIdRequest): Promise<UserEntity | null> {
    try {
      const docRef = this.collection.doc(request.id);
      const docSnap = await docRef.get();
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
        createdAt: now,
        updatedAt: now
      };

      const docRef = await this.collection.add(entityData);
      const docSnap = await docRef.get();
      
      return firestoreDocToEntity<UserEntity>(docSnap)!;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async update(request: UpdateUserRequest): Promise<UserEntity | null> {
    try {
      const docRef = this.collection.doc(request.id);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists) {
        return null;
      }

      const updateData: Partial<Omit<UserEntity, 'id' | 'createdAt'>> = {
        updatedAt: new Date().toISOString()
      };

      if (request.email !== undefined) updateData.email = request.email;
      if (request.firstName !== undefined) updateData.firstName = request.firstName;
      if (request.lastName !== undefined) updateData.lastName = request.lastName;
      if (request.role !== undefined) updateData.role = request.role;
      if (request.permissions !== undefined) updateData.permissions = request.permissions;

      await docRef.update(updateData);
      
      const updatedDocSnap = await docRef.get();
      return firestoreDocToEntity<UserEntity>(updatedDocSnap);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async delete(request: DeleteUserRequest): Promise<boolean> {
    try {
      const docRef = this.collection.doc(request.id);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
} 