import {
  Inject,
  OnModuleDestroy,
  Global,
  Module,
  DynamicModule,
} from '@nestjs/common';
import {
  createAsyncClientOptions,
  createClient,
  RedisClient,
} from './redis-client.provider';
import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions | RedisModuleOptions[],
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    return {
      module: RedisCoreModule,
      providers: [
        createClient(),
        { provide: REDIS_MODULE_OPTIONS, useValue: options },
      ],
      exports: [RedisService],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [RedisService],
    };
  }

  onModuleDestroy() {
    const closeConnection =
      ({ clients, defaultKey }: RedisClient) =>
      (options: RedisModuleOptions | RedisModuleOptions[]) => {
        const name = !Array.isArray(options)
          ? options.name || defaultKey
          : defaultKey;
        const client = clients.get(name);

        if (client && !(!Array.isArray(options) ? options.keepAlive : false)) {
          client.disconnect();
        }
      };

    const closeClientConnection = closeConnection(this.redisClient);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClientConnection);
    } else {
      closeClientConnection(this.options);
    }
  }
}
