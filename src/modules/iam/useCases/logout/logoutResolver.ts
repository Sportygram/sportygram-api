import { FieldResolver } from "nexus";
import { logoutUseCase } from ".";
import { LogoutDTO } from "./LogoutDTO";

export const logoutResolver: FieldResolver<
    "Mutation",
    "logout"
> = async (_parent, _args, ctx) => {
    const dto = { userId: ctx.reqUser?.userId } as LogoutDTO;

    try {
        const result = await logoutUseCase.execute(dto);

        if (result.isRight()) {
            return true;
        } else {
            throw new Error(result.value.errorValue().message);
        }
    } catch (err) {
        throw new Error(err);
    }
}