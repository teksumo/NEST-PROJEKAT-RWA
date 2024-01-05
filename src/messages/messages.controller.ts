import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/messages.dto';
import { Public } from 'src/user/auth/decorators/public.decorator';
import { Roles } from 'src/user/auth/decorators/roles.decorator';
import UserType from 'src/enums/UserType';

@Controller('messages')
export class MessagesController {

    constructor(private readonly messagesService: MessagesService){}


    @Roles(UserType.KORISNIK,  UserType.KUVAR, UserType.ADMIN)
    @Post()
    createMessage(@Body() body: CreateMessageDto ){
        return this.messagesService.createMessage(body);
    }

   

    @Delete(':id')
    deleteMessagesByReceptId(@Param('id', ParseIntPipe) id: number){

        return this.messagesService.deleteMessagesByReceptId(id);
    }

    

    @Delete('/deleteMessage/:id')
    deleteMessageById(@Param('id', ParseIntPipe) id: number){

        return this.messagesService.deleteMessageById(id);
    }
}
