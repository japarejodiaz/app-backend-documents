export const PasswordHasherPortToken = Symbol('PasswordHasherPort');

export interface PasswordHasherPort {
  hash(password: string): Promise<string>;
  compare(password: string, hashed: string): Promise<boolean>;
}
