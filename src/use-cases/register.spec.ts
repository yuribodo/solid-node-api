import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

describe('RegisterUseCase', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Mario Yuri',
      email: 'mario@mario.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registrarion', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Mario Yuri',
      email: 'mario@mario.com',
      password: '123456',
    })

    const isPasswordHasehd = await compare('123456', user.password_hash)

    expect(isPasswordHasehd).toBe(true)
  })

  it('should not be able to register with the same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'mario@mario.com'

    await registerUseCase.execute({
      name: 'Mario Yuri',
      email,
      password: '123456',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'Mario Yuri',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
