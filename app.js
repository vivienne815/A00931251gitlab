// add to movie list
var movieList = document.getElementById("movieList");
var movieHistoryList = [];

// window.onload = getMovies();

// function getMovies() {
//     if (localStorage) {        
//         var item = localStorage.getItem(key);                
//         addTodosToPage();
//     }
//     else {
//         console.log("Error: you don't have localStorage!");
//     }
// }

// function addTodosToPage() {
//     var ul = document.getElementById("todoList");
//     var listFragment = document.createDocumentFragment();
//     for (var i = 0; i < todos.length; i++) {
//         var todoItem = todos[i];
//         var li = createNewTodo(todoItem);
//         listFragment.appendChild(li);
//     }
//     ul.appendChild(listFragment);
// }

// function saveTodoItem(todoItem) {
//     if (localStorage) {
//         var key = "todo" + todoItem.id;
//         var item = JSON.stringify(todoItem);
//         localStorage.setItem(key, item);
//     }
//     else {
//         console.log("Error: you don't have localStorage!");
//     }
// }              

function Movie(name, watched){
    this.movieName = name;
    this.watched = watched;
}

// when the "ADD MOVIE" button is clicked...
document.getElementById("add").onclick = function() {
    // get the text input from the user
	var input = titleCase(document.getElementById("addMovieInput").value);
    // store the reference of the Movie History List
    var table = document.getElementById("movieHistory");
    var count = 0;

    // check if input is empty, null or undefined
    if (!input || input.length === 0){
        // print error message and do nothing
        alert("Please enter a movie before adding.")
    }
    else {  
        // reference: https://stackoverflow.com/questions/36035736/add-remove-li-element-from-the-ul-javascript
        var element = document.createElement('li');
        
        // add the new li element to the ul element
        movieList.appendChild(element);
        // concatenate the input with an [x] for deletion
        element.innerHTML = input + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button>Delete</button>";

        // if the Movie History array does not already have the movie
        // reference: https://stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e
        if (!(movieHistoryList.some(e => e.movieName === input))){    
            // new object with name = input, watched = 1
            var newMovie = new Movie(input, 1);
            // push object into array
            movieHistoryList.push(newMovie);

            // insert a new table row at the end (-1)
            var row = table.insertRow(-1);

            // the 0th cell (first column) is the name of the Movie
            row.insertCell(0).innerHTML = newMovie.movieName;
            // the 1st cell (second column) gets 1 for the first time
            row.insertCell(1).innerHTML = newMovie.watched;            
        }
        else {
            // if the movie already exists in Movie History array...            
            // get the count that is already in the table 
            // reference: https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array
            var inputIndex = movieHistoryList.findIndex(i => i.movieName === input);
            
            count = movieHistoryList[inputIndex].watched;
            count = count + 1;
            movieHistoryList[inputIndex].watched = count;
            table.rows[inputIndex + 1].cells[1].innerHTML = count;
        }

        // clear the input text box
        clearInput();
        
        // add an event listener to each list item so that it can be deleted later when clicked
        element.addEventListener('click', function () {
            this.parentNode.removeChild(this);
            
            // when deleting the list item, we also want to decrease the movie history count by 1
            // first store the index of where the input is in the history array
            var listIndex = movieHistoryList.findIndex(i => i.movieName === input);

            // get the existing count and store into variable oldCount
            // first uses listIndex to get the row index (+ 1 because there is a table header)
            // retrieves the second cell (.cells[1]) to get the current count value
            var oldCount = movieHistoryList[listIndex].watched;
            oldCount = oldCount - 1;
            movieHistoryList[listIndex].watched = oldCount;
            if (oldCount == 0){
                movieHistoryList.splice(listIndex, 1);
                table.deleteRow(listIndex + 1);
            }
            else {
                // after decreasing the count by one, assign the count back to the correct cell
                table.rows[listIndex + 1].cells[1].innerHTML = oldCount;
            }      
        });    
    }    
}

// function to clear the input box
function clearInput() {
    document.getElementById("addMovieInput").value = "";
}

// function that normalizes the input to a title case (ie. first letter capitalized and all others lower case)
// reference: https://www.freecodecamp.org/news/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27/
function titleCase(str) {
  // split the string up so that each word is in an array element
  str = str.toLowerCase().split(' ');
  // loop through the array of words
  for (var i = 0; i < str.length; i++) {
    // upper case the first letter and return the rest of the word in lower case
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  // join all the words together to return
  return str.join(' ');
}

// when the "CLEAR MOVIES" button is clicked...
document.getElementById("clear").onclick = function() {
	// Continue to remove li items until ul has no more child nodes
	movieList.innerHTML = '';	
}
