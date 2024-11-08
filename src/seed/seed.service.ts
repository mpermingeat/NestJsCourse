import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-response.inteface';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) //injeccion del modelo de mongo
    private readonly pokemonModel: Model<Pokemon>, //declaracion para el manejo del modelo de pokemon
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed(limit: number) {
    await this.pokemonModel.deleteMany({});
    console.log(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);

    const data = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
    );

    const pokemonToInsert = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      pokemonToInsert.push({ name, no });
    });

    this.pokemonModel.insertMany(pokemonToInsert);

    return data.results;
  }
}
