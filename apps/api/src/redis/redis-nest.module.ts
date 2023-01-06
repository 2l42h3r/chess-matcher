import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisCoreModule } from './redis-core.module';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

@Global()
@Module({})
export class RedisNestModule {
  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    return {
      module: RedisNestModule,
      imports: [RedisCoreModule.register(options)],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisNestModule,
      imports: [RedisCoreModule.forRootAsync(options)],
    };
  }
}
