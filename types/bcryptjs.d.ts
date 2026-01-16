declare module 'bcryptjs' {
  export function genSaltSync(rounds?: number): string;
  export function genSalt(rounds: number, callback: (err: Error | null, salt: string) => void): void;
  export function hashSync(s: string, salt: string | number): string;
  export function hash(s: string, salt: string | number, callback: (err: Error | null, hash: string) => void): void;
  export function hash(s: string, salt: string | number): Promise<string>;
  export function compareSync(s: string, hash: string): boolean;
  export function compare(s: string, hash: string, callback: (err: Error | null, same: boolean) => void): void;
  export function compare(s: string, hash: string): Promise<boolean>;
  export default {
    genSaltSync,
    genSalt,
    hashSync,
    hash,
    compareSync,
    compare,
  };
}
