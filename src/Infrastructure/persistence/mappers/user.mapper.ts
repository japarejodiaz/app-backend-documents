import { UserEntity } from '../entities/user.entity';
import { User } from '../../../Domain/users/user';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.role,
      entity.createdAt
    );
  }

  static toEntity(domain: User): Partial<UserEntity> {
    return {
      id: domain.id,
      email: domain.email,
      role: domain.role,
      createdAt: domain.createdAt
    };
  }
}
