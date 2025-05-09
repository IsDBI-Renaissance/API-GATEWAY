import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './common/audit/audit.module';
import { SecurityModule } from './common/security/security.module';
import { SecurityMiddleware } from './common/security/security.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs-gateway'),
    GatewayModule,
    AuthModule,
    UsersModule,
    AuditModule,
    SecurityModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
