import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from '@app/tags/dto/create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
