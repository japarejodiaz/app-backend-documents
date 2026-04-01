import { UserEntity } from '../entities/user.entity';
import { User } from '../../../Domain/users/user';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.role,
      entity.createdAt,
      entity.password
    );
  }

  static toEntity(domain: User): Partial<UserEntity> {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      role: domain.role,
      createdAt: domain.createdAt,
      password: domain.password
    };
  }
}
