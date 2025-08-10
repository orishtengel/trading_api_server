import { IBotRepository } from 'src/data/bot/bot.repository.interface';
import { BotEntity } from 'src/data/bot/bot.entities';
import { CreateBotRequest, UpdateBotRequest, FindByIdRequest, DeleteBotRequest } from 'src/data/bot/contracts/requestResponse';
import { db } from '@shared/firebase/firebase.admin.config';
import { firestoreDocToEntity, removeUndefinedValues } from '@shared/firebase/firestore.utils';

export class BotRepository implements IBotRepository {
  private getBotCollection(userId: string) {
    return db.collection('bots').doc(userId).collection('bots');
  }

  async create(request: CreateBotRequest): Promise<BotEntity> {
    try {
      const now = new Date().toISOString();
      const entityData = {
        name: request.name,
        userId: request.userId,
        status: request.status,
        configuration: request.configuration,
        createdAt: now,
        updatedAt: now
      };

      // Use auto-generated ID from Firestore in user's bot subcollection
      const botCollection = this.getBotCollection(request.userId);
      const docRef = await botCollection.add(entityData);
      const docSnap = await docRef.get();
      
      return firestoreDocToEntity<BotEntity>(docSnap)!;
    } catch (error) {
      console.error('Error creating bot:', error);
      throw new Error('Failed to create bot');
    }
  }

  async findById(request: FindByIdRequest): Promise<BotEntity | null> {
    try {
      // We need userId to find the bot in the correct subcollection
      // For now, we'll search across all users - this could be optimized if we pass userId
      const usersCollection = db.collection('users');
      const usersSnapshot = await usersCollection.get();
      
      for (const userDoc of usersSnapshot.docs) {
        const botCollection = this.getBotCollection(userDoc.id);
        const docRef = botCollection.doc(request.id);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
          return firestoreDocToEntity<BotEntity>(docSnap);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error finding bot by id:', error);
      return null;
    }
  }

  async findByUserId(userId: string): Promise<BotEntity[]> {
    try {
      const botCollection = this.getBotCollection(userId);
      const querySnapshot = await botCollection.get();
      return querySnapshot.docs
        .map((doc: any) => firestoreDocToEntity<BotEntity>(doc))
        .filter((bot): bot is BotEntity => bot !== null);
    } catch (error) {
      console.error('Error finding bots by user id:', error);
      return [];
    }
  }

  async update(request: UpdateBotRequest): Promise<BotEntity | null> {
    try {
      // We need to find the bot first to get the userId, then update in the correct subcollection
      const botCollection = this.getBotCollection(request.userId);
      const docRef = botCollection.doc(request.id);
      const docSnap = await docRef.get();
        
        if (docSnap.exists) {
          const updateData: Partial<Omit<BotEntity, 'id' | 'createdAt'>> = {
            updatedAt: new Date().toISOString()
          };

          // Note: ID and userId cannot be updated
          if (request.name !== undefined) updateData.name = request.name;
          if (request.status !== undefined) updateData.status = request.status;
          if (request.configuration !== undefined) updateData.configuration = request.configuration;

          // Remove undefined values before updating Firestore
          const cleanUpdateData = removeUndefinedValues(updateData);
          await docRef.update(cleanUpdateData);
          
          const updatedDocSnap = await docRef.get();
          return firestoreDocToEntity<BotEntity>(updatedDocSnap);
        }
      
      return null;
    } catch (error) {
      console.error('Error updating bot:', error);
      return null;
    }
  }

  async delete(request: DeleteBotRequest): Promise<boolean> {
    try {
      // We need to find the bot first to get the userId, then delete from the correct subcollection
      const usersCollection = db.collection('users');
      const usersSnapshot = await usersCollection.get();
      
      for (const userDoc of usersSnapshot.docs) {
        const botCollection = this.getBotCollection(userDoc.id);
        const docRef = botCollection.doc(request.id);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
          await docRef.delete();
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting bot:', error);
      return false;
    }
  }

  async findAll(): Promise<BotEntity[]> {
    try {
      const allBots: BotEntity[] = [];
      const usersCollection = db.collection('users');
      const usersSnapshot = await usersCollection.get();
      
      for (const userDoc of usersSnapshot.docs) {
        const botCollection = this.getBotCollection(userDoc.id);
        const querySnapshot = await botCollection.get();
        const userBots = querySnapshot.docs
          .map((doc: any) => firestoreDocToEntity<BotEntity>(doc))
          .filter((bot): bot is BotEntity => bot !== null);
        allBots.push(...userBots);
      }
      
      return allBots;
    } catch (error) {
      console.error('Error finding all bots:', error);
      return [];
    }
  }
} 