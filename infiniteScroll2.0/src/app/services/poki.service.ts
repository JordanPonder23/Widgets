import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokiService {

  constructor(private myhttp: HttpClient) { }

  getPokemon(id): Observable<any>{
    return this.myhttp.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`)
  }
}
