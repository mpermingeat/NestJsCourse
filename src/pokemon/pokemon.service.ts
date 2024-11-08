import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) //injeccion del modelo de mongo
    private readonly pokemonModel: Model<Pokemon>, //declaracion para el manejo del modelo de pokemon

    private readonly configService: ConfigService,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    console.log(paginationDto);
    //seteamos los valores default en la destructuracion
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        //con el sort igual a 1, ordenamos de manera ascendente
        no: 1,
      })
      //con el select, podemos selecionar las columnas en este caso con el - ignoramos esa columna
      .select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    if (!isNaN(+id)) {
      //busqueda por numero de pokemon
      pokemon = await this.pokemonModel.findOne({ no: id });
    }

    if (!pokemon && isValidObjectId(id)) {
      //busqueda por mongo id
      pokemon = await this.pokemonModel.findById(id);
    }

    if (!pokemon) {
      //busqueda por nombre
      pokemon = await this.pokemonModel.findOne({
        name: id.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no '${id}' not found`,
      );
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon: Pokemon = await this.findOne(id);

      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name
          .toLocaleLowerCase()
          .trim();
      }
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }

    return;
  }

  //* funcion para manejar excepciones, se arma un listado de errores controlados y no controlados
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Poken - Check server logs`,
    );
  }
}
