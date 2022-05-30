// import { TestUserRepo } from '../../repos/implementations/testUserRepo';
// import { AuthService } from '../../services/authService';
// import { RedisAuthService } from '../../services/redisAuthService';
// import { LoginUseCase } from './login';
// import { LoginDTO, LoginDTOResponse } from './loginDTO';

// import redisClient from '../../../../lib/infra/redis';
// import { getMockUsers } from '../../domain/userSpec';

// const redisAuthService: AuthService = new RedisAuthService(redisClient);

// const users = getMockUsers();
// const testUserRepo = new TestUserRepo(users);

// const loginUseCase = new LoginUseCase(testUserRepo, redisAuthService);

// const dto: any = {
// 	email: users[0].email.value,
// 	password: 'Pa55w0rd',
// 	ip: '1.1.1.1/32',
// };

// test('A call to login returns a valid auth token and a refresh token', async () => {
// 	const request = dto as LoginDTO;
// 	const result = await loginUseCase.execute(request);

// 	expect(result.isRight()).toBeTruthy();

// 	const resultDto: LoginDTOResponse = result.value.getValue();

// 	expect(resultDto).toBeTruthy();
// 	expect(resultDto.accessToken).toBeTruthy();
// 	expect(resultDto.refreshToken).toBeTruthy();
// });
// // Admin must pass a valid 2FA token when registering
test("adds 1 + 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
});
