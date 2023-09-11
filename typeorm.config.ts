import { DataSourceOptions } from "typeorm";
import { Images } from "src/entities/image.entity";
import { Messages } from "src/entities/message.entity";
import { Recepti } from "src/entities/recept.entity";
import { User } from "src/entities/user.entity";;


export const typeOrmConfig: DataSourceOptions = {
    type: "postgres",
    host: 'localhost',
    port: 5434,
    username: "postgres",
    password: "123",
    entities: [Images, User, Recepti, Messages],
    synchronize: true,
    database: "recepti4"
}