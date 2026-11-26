import { Test } from '@nestjs/testing'
import { AppController } from './app.controller.ts'
import { AppService } from './app.service.ts'
import type { TestingModule } from '@nestjs/testing'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Helia is running"', async () => {
      expect(await appController.getHeliaVersion()).toContain(
        'Helia is running'
      )

      await appController.onApplicationShutdown()
    })
  })
})
