import UserType from "src/enums/UserType";

export type JwtPayload = {
    id: number
    name: string
    email: string
    type: UserType
}