import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-scroll',
  templateUrl: './side-scroll.component.html',
  styleUrls: ['./side-scroll.component.scss']
})
export class SideScrollComponent implements OnInit {
  arrayOfItems = new Array();
  key = true;

  constructor() {
    
    let index = 0;
    while (index < 10) {
      this.arrayOfItems.push('item' + index)
      index++;
    }
  }

  ngOnInit() {
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async mouseDown(d) {
    console.log(d)
    this.key = true;
    while (this.key) {
      await this.delay(100);
      this.shift(d); 
    }
  }
  mouseUp() {
    //console.log("up")
    this.key = false;
  }
  reAdjustMargin(){
    let horBar = document.getElementById('widthIndex') as HTMLDivElement; 
    let width = horBar.offsetWidth
    /* console.log(width)
    console.log( this.arrayOfItems.length*60) */
    let classfulMargin = document.getElementsByClassName('item')
    let i = 0; 
    while(classfulMargin[i] != undefined) {
      let thisItem = classfulMargin[i] as HTMLElement;
      thisItem.style.marginLeft = "40px";
      i++;
    }
    return 'itemized'
  }
  shift(direction){
    let classfulMargin = document.getElementsByClassName('item')
    let i = 0; 
    while(classfulMargin[i] != undefined) {
      const thisItem = classfulMargin[i] as HTMLElement;
      const leftProperty = window.getComputedStyle(thisItem, null).getPropertyValue('left');
      const rightProperty = window.getComputedStyle(thisItem, null).getPropertyValue('right');
      const leftValue= parseInt( leftProperty.substring(0, leftProperty.length-2) );
      const rightValue= parseInt( rightProperty.substring(0, rightProperty.length-2))
      ;
       (direction =='R') ?
       thisItem.style.right =  5 +rightValue+'px'
       : thisItem.style.left = 5 +leftValue+"px"; 
      i++;
    }
  }
  throughArray() {

  }
}
