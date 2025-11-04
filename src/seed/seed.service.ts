import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response-inferface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http:AxiosAdapter,
  ){}

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data =  await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert:{name:string,no:number}[]=[];


    data.results.forEach( ({name, url}) => {

      const segments = url.split('/');
      const no:number = +segments[segments.length-2];

      pokemonToInsert.push({name, no});

    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }

  async executeSeedPocoEficiente() {

    await this.pokemonModel.deleteMany({});

    const data =  await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const insertPromisesArray:Promise<Pokemon>[] = [];

    data.results.forEach( ({name, url}) => {
      const segments = url.split('/');
      const no:number = +segments[segments.length-2];

      console.log({name, no});
      // const pokemon = await this.pokemonModel.create({name,no})
      insertPromisesArray.push(
        this.pokemonModel.create({name, no})
      );

    });

    await Promise.all(insertPromisesArray);

    //const insert = await this.pokemonModel.createCollection()

    return 'Seed Executed';
  }


}
