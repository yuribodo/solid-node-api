import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it, beforeEach } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('RegisterUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Mario Yuri',
      email: 'mario@mario.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registrarion', async () => {
    const { user } = await sut.execute({
      name: 'Mario Yuri',
      email: 'mario@mario.com',
      password: '123456',
    })

    const isPasswordHasehd = await compare('123456', user.password_hash)

    expect(isPasswordHasehd).toBe(true)
  })

  it('should not be able to register with the same email twice', async () => {
    const email = 'mario@mario.com'

    await sut.execute({
      name: 'Mario Yuri',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Mario Yuri',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
