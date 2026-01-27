declare module "pg" {
  import type { PoolConfig } from "pg-pool";

  export class Pool {
    constructor(config?: PoolConfig);
    end(): Promise<void>;
  }
}
