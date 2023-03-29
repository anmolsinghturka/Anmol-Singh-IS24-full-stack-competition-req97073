/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    productId: string;

    @Prop({ required: true })
    productName: string;

    @Prop({ required: true })
    productOwnerName: string;

    @Prop({ required: true })
    developers: string[];

    @Prop({ required: true })
    scrumMasterName: string;

    @Prop({ required: true })
    startDate: string;

    @Prop({ required: true })
    methodology: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
