import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.ts'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}
bootstrap().catch((err) => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
