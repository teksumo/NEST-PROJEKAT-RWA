import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/messages.dto';

@Controller('messages')
export class MessagesController {

    constructor(private readonly messagesService: MessagesService){}


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
