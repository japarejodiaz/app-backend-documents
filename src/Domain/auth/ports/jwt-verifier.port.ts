export const JwtVerifierPortToken = Symbol('JwtVerifierPort');

export interface JwtVerifierPort {
  verify<T extends object = any>(token: string): T;
}


