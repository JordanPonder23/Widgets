import { Component, OnInit } from '@angular/core';
import { PokiService } from '../services/poki.service';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent implements OnInit {
  baseIndex;
  data = new Array();
  zState;
  loadingIndex;
  //----
  pageOptions = new Array();
  pages = new Array();
  //----

  filteredList: any[];
  _filterBy;
  get filterBy(): string {
    return this._filterBy;
  }
  set filterBy(temp: string) {
    this._filterBy = temp;
    this.filteredList = this._filterBy ? this.filtering(this._filterBy) : this.data
  }


  filtering(filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase();
    return this.data.filter((metalist) =>
      metalist.pokeName.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }
  //--
  constructor(private poke: PokiService) {
    this.baseIndex = 1; //always has to be one up
    while (this.baseIndex < 36) {
      this.poke.getPokemon(this.baseIndex).subscribe(pokemon => {
        this.data.push({
          pokeName: pokemon.name,
          baseExp: pokemon.base_experience,
          abilities: pokemon.abilities
        })
      })
      this.baseIndex++;
    }
    this.filteredList = this.data;
    this.zState = 1;
    this.loadingIndex = 0;
    ///------     
  }

  ngOnInit() {

  }
  pageLength() {
    let nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    nextButton.innerHTML = "Next"
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    let tableYbar = document.getElementById('scrollable') as HTMLTableElement
    let navArea = document.getElementById('navArea') as HTMLDivElement;
    if (select.value == 'all') {
      this.filteredList = this.data;
      navArea.style.display = "none";
      tableYbar.style.height = "500px"
    } else {
      navArea.style.display = "block"
      tableYbar.style.height = "100%"
      let i = (parseInt(select.value) - 1);
      let pageArray = new Array();
      while (i > -1) {
        pageArray.push(this.data[i])
        i--;
      }
      this.filteredList = pageArray.reverse();
    }
    this.pageButtons()
  }
  //--paging
  pageIndex() {
    let pageIndex = [];
    if (this.data.length >= 5 && this.data.length < 10) {
      pageIndex.push('5')
    } else if (this.data.length >= 10 && this.data.length < 25) {
      pageIndex.push('5'); pageIndex.push('10')
    } else if (this.data.length >= 25 && this.data.length < 100) {
      pageIndex.push('5'); pageIndex.push('10'); pageIndex.push('25')
    } else {
      pageIndex.push('5'); pageIndex.push('10');
      pageIndex.push('25'); pageIndex.push('100')
    }
    return pageIndex;
  }
  pageButtons() {
    let pageButtons = []
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    let buttonCount = this.data.length / parseInt(select.value);
    let pageNum = 1;
    while (buttonCount > 0) {
      pageButtons.push(pageNum)
      pageNum++;
      buttonCount--;
    }
    return pageButtons
  }
  thisPage(pg) {
    //-disable prev button
    let disablePrev = document.getElementById('prevButton') as HTMLButtonElement;
    (pg == 1) ? disablePrev.disabled = true : disablePrev.disabled = false;
    //--
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    const end = parseInt(select.value) * pg;
    let start = end - parseInt(select.value)
    this.filteredList = new Array();
    while (start < end) {
      (this.data[start] != undefined) ? this.filteredList.push(this.data[start]) : null;
      start++;
    }
    //this final object of a page will be an empty object with attirbutes that are empty that will trigger
    // the *ngIf within the ngFor which will trigger a button to be included in the last element.
    this.filteredList.push({
      pokeName: '',
      baseExp: "",
      abilities: []
    })
  }
  //---Nav Buttons
  directional(D) {
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    let nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    if (nextButton.innerText == 'Load More') {
        this.filteredList = new Array(); 
        this.getMore( parseInt(select.value) )
        this.pageButtons(); 
    } else {
      if (D == 'P') {
        nextButton.innerHTML = "Next"
        let i = 0;
        let index
        this.data.forEach(row => {
          if (this.filteredList[0] == row) {
            console.log("first element is: ", row)
            index = i;
          }
          i++;
        });
        this.filteredList = new Array();
        if (index != parseInt(select.value)) {
          let initialIndex = index;
          while ((index - parseInt(select.value)) > 0) {
            if ((initialIndex - index) == parseInt(select.value)) {
              break;
            }
            this.filteredList.push(this.data[index - 1])
            index--;
          }
        } else {

          let disablePrev = document.getElementById('prevButton') as HTMLButtonElement;
          disablePrev.disabled = true;
          while (index > 0) {
            this.filteredList.push(this.data[index - 1])
            index--;
          }
        }

        this.filteredList.reverse();
      } else if (D == 'N') {
        let disablePrev = document.getElementById('prevButton') as HTMLButtonElement;
        disablePrev.disabled = false;
        let index;
        console.log('last pokemon: ', this.filteredList[this.filteredList.length - 1])
        this.data.forEach(row => {
          if (this.filteredList[this.filteredList.length - 1] == row) {
            index = this.data.indexOf(row) + 1; //new start index. 
          }
        });
        this.filteredList = new Array();
        let ind = (index + parseInt(select.value));
        while (index < ind && this.data[index] != undefined) {
          this.filteredList.push(this.data[index])
          index++;
        }

        if (this.data[index] == undefined) {
          nextButton.innerHTML = "Load More"
        }
        //this.getMore(parseInt(select.value))
      }
    }
  }
  //--
  tesEndOfPage(i) {

    let select = document.getElementById('selectElement') as HTMLSelectElement;
    if (parseInt(select.value) <= i) {
      return false;
    } else {
      return true;
    }
  }

  //load more button automatically generated in the the page that is short. 
  loadMore(index) {
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    const crrct = parseInt(select.value);
    let variance = crrct - index;
    console.log("new values: ", variance)
    let deleteLoadButton = document.getElementById('loadRow') as HTMLTableRowElement;
    deleteLoadButton.remove();
    this.getMore(variance);
    let nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    nextButton.innerHTML = "Load More"
  }
  //------infinite scroll
  getMore(num) {
    let origin = this.baseIndex;
    while (this.baseIndex < (origin + num)) {
      this.poke.getPokemon(this.baseIndex).subscribe(pokemon => {
        this.data.push({
          pokeName: pokemon.name,
          baseExp: pokemon.base_experience,
          abilities: pokemon.abilities
        })
        this.filteredList.push({
          pokeName: pokemon.name,
          baseExp: pokemon.base_experience,
          abilities: pokemon.abilities
        })
      })
      let select = document.getElementById('selectElement') as HTMLSelectElement;
      (select.value == 'all') ? this.filteredList = this.data : null;
      this.baseIndex++;
    }


  }
  onScroll() {

    let scrollMes = document.getElementById("scrollable") as HTMLDivElement;

    if (scrollMes.scrollTop >= scrollMes.scrollHeight - scrollMes.clientHeight) {
      this.getMore(3);
    }
  }
  //------sort alphabetically and numerically
  alphabetize() {
    this.filteredList = this.filteredList.sort((n1, n2) => {
      if (n1.pokeName > n2.pokeName) {
        return (-1 * this.zState);
      }
      if (n1.pokeName < n2.pokeName) {
        return this.zState;
      }
      return 0;
    });
    this.zState = this.zState * -1
  }
  baseExperience() {
    this.filteredList = this.filteredList.sort((n1, n2) => {
      if (n1.baseExp > n2.baseExp) {

        return (-1 * this.zState);
      }
      if (n1.baseExp < n2.baseExp) {
        return this.zState;
      }
      return 0;
    })
    this.zState = this.zState * -1
  }
  /////-----
}
