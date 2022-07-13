import { FieldResolver } from "nexus";
import { generateChatToken } from ".";
import { CreateChatUserDTO } from "../createChatUser/createChatUserDTO";

export const chatTokenResolver: FieldResolver<"Query", "chatToken"> = async (
    _parent,
    args,
    ctx
) => {
    const dto = {
        ...args,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as CreateChatUserDTO;

    const result = await generateChatToken.execute(dto);

    if (result.isRight()) {
        const token = result.value.getValue();
        return token;
    } else {
        const error = result.value;
        throw new Error(error.errorValue().message);
    }
};
