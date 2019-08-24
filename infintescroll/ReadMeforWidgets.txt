The above file has an example of the model 
a table with a functional infinite scroll, pulling from pokemon api. 

a table where the header sits OVER the rows. (see the scss for the infinite scroll component): 

tbody {
    display:block;
    height:500px;
    overflow:auto;
}
thead, tbody tr {
    display:table;
    width:100%;
    table-layout:fixed;/* even columns width , fix width of table too*/
}

A way to sort based on alphabetical order, where 'zState' starts as one and is changed upon triggering of the 
function to reverse the order, next call: 

zState = 1; 
....
 alphabetize() {
    this.data = this.data.sort((n1, n2) => {
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

And a pretty much identical function, called baseExperience, which orders an array ( consequently, rows of a table)
in ascending then descending numerical order. 
