import { Component, OnInit } from '@angular/core';
import { PokiService } from '../services/poki.service';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

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
  currentPage = 1;

  filteredList: any[];
  _filterBy;
  get filterBy(): string {
    return this._filterBy;
  }
  set filterBy(temp: string) {
    this._filterBy = temp;
    this.filteredList = this._filterBy ? this.filtering(this._filterBy) : this.thisPage(this.currentPage)
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
 
  async reloadFunction() {
    await this.delay(1000);
    if (this.filteredList.length == 0) {
      let select = document.getElementById('selectElement') as HTMLSelectElement;
      let loadOnPrevFailure = this.data.length - (parseInt(select.value)*2)
      while (loadOnPrevFailure < (this.data.length - (parseInt(select.value)) ) ) {
        this.filteredList.push(this.data[loadOnPrevFailure]);
        loadOnPrevFailure++;
      }
    }
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
    this.pageButtons(false);

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
  expandNav(direction) {
    let parse = [];
    let counter = 0;
    while (true) {
      if (counter > 0 && this.savedButtons[counter] == this.savedButtons[0]) {
        break;
      } else {
        parse.push(this.savedButtons[counter]);
      }
      counter++;
    }
    console.log(direction, "  <direction")
    if (direction == 'F') {
      let two = 0;
      this.savedButtons = new Array()
      parse.forEach(button => {
        if (two < 2) {
          console.log(button)
          let showButt = document.getElementById(button) as HTMLButtonElement;
          console.log(":: ", showButt)
          showButt.style.display = "inline-block";
          console.log(":: ", showButt)
        } else {
          this.savedButtons.push(button)
        }
        two++;
      });

      let expandButton = document.getElementById('expandB') as HTMLButtonElement;
      expandButton.style.display = "inline-block";
    }
  }
  //====THIS ALL IS WORKING WITH NAV BINDING
  navBindex = 3;
  savedButtons = [];
  extraButtons(pg) {
    if (parseInt(pg) > this.navBindex) {
      let button = document.getElementById(pg + 'avail') as HTMLButtonElement;
      button.style.display = 'none';
      let expandButton = document.getElementById('expandF') as HTMLButtonElement;
      expandButton.style.display = "inline-block";
      this.savedButtons.push(pg + 'avail');
      return ''
    } else {
      return ''
    }
  }
  //====-
  pageButtonsLength;
  pageButtons(newPg) {
    let pageButtons = []
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    let buttonCount = this.data.length / parseInt(select.value);
    let pageNum = 1;
    while (buttonCount > 0) {
      pageButtons.push(pageNum)
      pageNum++;
      buttonCount--;
    }
    this.pageButtonsLength = pageNum;
    (newPg) ? this.currentPage = this.pageButtonsLength: null ;
    return pageButtons
  }
  thisPage(pg) {
    this.currentPage = pg;
    //-disable prev button
    let disablePrev = document.getElementById('prevButton') as HTMLButtonElement;
    (pg == 1) ? disablePrev.disabled = true : disablePrev.disabled = false;
    //--
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    const end = parseInt(select.value) * pg;
    let start = end - parseInt(select.value)
    this.fixNextButton(pg);
    this.filteredList = new Array();
    while (start < end) {
      (this.data[start] != undefined) ? this.filteredList.push(this.data[start]) : null;
      start++;
    }

    if ((pg + 1) == this.pageButtonsLength) {
      //this final object of a page will be an empty object with attirbutes that are empty that will trigger
      // the *ngIf within the ngFor which will trigger a button to be included in the last element.
      this.filteredList.push({
        pokeName: '',
        baseExp: "",
        abilities: []
      })
    }
    this.checkAsLastButton(parseInt(select.value), pg); 
    return this.filteredList
  }
  checkAsLastButton(interval:number, pg ){
  /*   console.log("-----working with: ")
    console.log("page number selected: ", pg)
    console.log("intervals of        :", interval)
    console.log("amount of values    :", this.data.length); */
    let nxt = document.getElementById("nextButton") as HTMLButtonElement; 

    (pg* interval ==this.data.length) ? nxt.innerHTML = 'Load More' : null;
  }
  fixNextButton(pg) {
    let nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    (nextButton.innerText == 'Load More') ?
      (pg == (this.pageButtonsLength - 1)) ? null : nextButton.innerText = 'Next' : null;
  }
  //this is literally just to find an excuse to show the little spinny thing.. 
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  standardLoadedOrder() {
    let select = document.getElementById('selectElement') as HTMLSelectElement;

    this.data.indexOf(this.filteredList[0])
    let index = 0;
    while (index < this.data.indexOf(this.filteredList[0])) {
      if (this.data.indexOf(this.filteredList[0]) > index && this.data.indexOf(this.filteredList[0]) < index + parseInt(select.value)) {
        break;
      }
      index = index + parseInt(select.value);
    }
    let topIndx = index + parseInt(select.value);
    this.filteredList = new Array();
    while (index < topIndx) {
      this.filteredList.push(this.data[index])
      index++;
    }
    console.log("---end of standardization")
  }
  //---Nav Buttons
  directional(D) {
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    let nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    if (nextButton.innerText == 'Load More' && D == 'N') {

      let howManyToLoad;
      let buttonMove; 
      if ( (this.filteredList.length) % parseInt(select.value) != 0) {
        console.log("was remainder!  ", this.filteredList.length % parseInt(select.value))
        howManyToLoad = this.filteredList.length % parseInt(select.value);
        buttonMove = 0;
      } else if (this.filteredList.length % parseInt(select.value) == 0) {
        //this.currentPage = this.currentPage + 1;
        buttonMove = 1; 
        console.log("was NOT remainder: ", this.filteredList.length % parseInt(select.value))
        howManyToLoad = parseInt(select.value); this.filteredList = new Array();
      }
      
      this.getMore(howManyToLoad, buttonMove);
      

    } else if(D == 'l' || D== 'f'){
      select.value
      this.filteredList = new Array(); 
      let index = 0; 
      while(D == 'f' && index < parseInt(select.value)){
        this.filteredList.push(this.data[index]);
        index++; 
        this.currentPage =1; 
      }
      let lenght = this.data.length;
      let buttonCount = 0; 
      while (lenght > 0){
        buttonCount++; 
        lenght = lenght - parseInt(select.value); 
      }
      let startIndex = (buttonCount*parseInt(select.value)) - parseInt(select.value);
      console.log(startIndex, " start at")
      console.log(this.data.length, " end at")
      let enablePrev = document.getElementById('prevButton') as HTMLButtonElement;
      enablePrev.disabled = false; 
      
       while(D == 'l' && startIndex <= this.data.length-1){
        nextButton.innerHTML = 'Load More'
        this.filteredList.push(this.data[startIndex]);
        startIndex++; 
        this.currentPage =buttonCount; 
      } 
    } else {
      if (D == 'P') {
        this.currentPage = this.currentPage - 1;
        console.log(this.filteredList[0], " <---")
        nextButton.innerHTML = "Next"
        nextButton.disabled = false; 
        let i = 0;
        let index;
        this.standardLoadedOrder();
        this.data.forEach(row => {
          if (this.filteredList[0].pokeName == row.pokeName) {
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
      } else if (D == 'N' && nextButton.innerText != 'Load More') {
        this.currentPage = this.currentPage + 1;
        console.log("we're not hitting this are we??")
        let disablePrev = document.getElementById('prevButton') as HTMLButtonElement;
        disablePrev.disabled = false;
        let index;
        this.standardLoadedOrder();
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
          nextButton.innerHTML = "Load More";
          nextButton.disabled = false;
        }
      }
    }
  }
  //--
  tesEndOfPage(i) {
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    let nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    if (parseInt(select.value) <= i) {
      return false;
    } else {
      (nextButton.innerText == 'Next') ? nextButton.disabled = true : nextButton.disabled = false;
      return true;
    }
  }

  //load more button automatically generated in the the page that is short. 
  loadMore(index) {
    
    let keepButtIndex = this.currentPage; 
    let select = document.getElementById('selectElement') as HTMLSelectElement;
    const crrct = parseInt(select.value);
    let variance = crrct - index;

    let deleteLoadButton = document.getElementById('loadRow') as HTMLTableRowElement;
    deleteLoadButton.remove();
    this.getMore(variance, 0);
    let nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    nextButton.innerHTML = "Load More";
    nextButton.disabled = false;
    let i = 0;
    this.filteredList.forEach(element => {
      if (element.pokeName == '' || element.pokeName == null) {
        this.filteredList.splice(i, 1);
      }
      i++
    });
    this.currentPage = keepButtIndex
  }

  //------infinite scroll
  getMore(num, adjustButton) {

    let select = document.getElementById('selectElement') as HTMLSelectElement;
    (num == undefined) ? num = parseInt(select.value) : null;
    let origin = this.baseIndex;
    console.log(parseInt(select.value), " <---- select value")
    console.log(this.baseIndex, " <---base index")
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
    let aroundFix = this.currentPage
    this.pageButtons(true);
     this.currentPage = aroundFix + adjustButton;   
  }
  onScroll() {
    let scrollMes = document.getElementById("scrollable") as HTMLDivElement;

    if (scrollMes.scrollTop >= scrollMes.scrollHeight - scrollMes.clientHeight) {
      this.getMore(3, 0);
    }
  }
  //------sort alphabetically and numerically
  alphabetize() {
    this.filteredList = this.filteredList.sort((n1, n2) => {
      if (n1.baseExp == "") {
        return 1;    //keeps the load more button on the bottom
      }
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
      if (n1.baseExp == "") {
        return 1;    //keeps the load more button on the bottom
      }
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
