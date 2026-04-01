import { User } from './user';

export const UserRepositoryPortToken = Symbol('UserRepositoryPort');

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
