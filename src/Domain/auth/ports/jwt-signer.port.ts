export const JwtSignerPortToken = Symbol('JwtSignerPort');

export interface JwtSignerPort {
  sign(payload: any): string;
}
