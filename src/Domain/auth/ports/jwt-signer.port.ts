export const JwtSignerPortToken = Symbol('JwtSignerPort');

export interface JwtSignerPort {
  sign(payload: Record<string, any>, expiresIn?: string): string;
}
