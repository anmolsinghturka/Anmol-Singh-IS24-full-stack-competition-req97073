/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/dto/users.dto';
import { User, UserDocument } from 'src/models/users.models';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    Add(body: UserDto) {
        return this.userModel.create(body);
    }

    FindAll() {
        return this.userModel.find();
    }

    FindOne(productId: string) {
        return this.userModel.findOne({ productId: productId });
    }

    Update(id: string, body: UserDto) {
        return this.userModel.findByIdAndUpdate(
            { _id: id },
            { $set: body },
            { new: true },
        );
    }

    Delete(productId: string) {
        return this.userModel.deleteOne({ productId: productId });
    }

    FindMongoOne(id: string) {
        return this.userModel.findOne({ _id: id });
    }

    SearchScrumMaster(key: string) {
        const keyword = key
            ? {
                $or: [
                    { scrumMasterName: { $regex: key, $options: 'i' } },
                ],
            }
            : {};
        return this.userModel.find(keyword);
    }

    searchDeveloper(name: string) {
        const regex = new RegExp(name, 'i');
        return this.userModel.find({
            developers: { $regex: regex },
        }).exec();
    }

    GenerateRandomProducts() {
        for (let index = 0; index < 30; index++) {
            const fakeProduct = {
                productId: faker.datatype.number({ max: 9999 }),
                productName: faker.name.lastName(),
                productOwnerName: "Owner",
                developers: [
                    faker.name.firstName(),
                    faker.name.firstName(),
                    faker.name.firstName(),
                    faker.name.firstName(),
                    faker.name.firstName(),
                ],
                scrumMasterName: faker.name.fullName(),
                startDate: "2000-03-13",
                methodology: "Agile"
            };

            this.userModel.create(fakeProduct);
        }
        return 'success';
    }
}
