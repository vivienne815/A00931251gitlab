// Kirk Wong A00883226
// Vivienne Li A00931251
// COMP 1800 - Movie App

// save the references to html elements since we will refer to them several times
var movieList = document.getElementById("movieList");
var table = document.getElementById("movieHistory");
var tableBody = table.getElementsByTagName('tbody')[0];
var movieHistoryList = [];

// localStorage reference: http://archive.oreilly.com/oreillyschool/courses/javascript2/TodoAppWithLocalStorage.html

// use the .onload function to get a list of all movies that were stored with localStorage
window.onload = getMovies();

// getMovies function gets all movies stored in localStorage
function getMovies() {
    // if items exist in localStorage
    if (localStorage) {
        // loop through all of the items stored in localStorage
        for (var i = 0; i < localStorage.length; i++) {
            // for each item, get the key 
            var key = localStorage.key(i);
            // use the key to determine whether the item is a movie object
            if (key.substring(0, 6) == "movie-") {
                // if it is a movie item, get the item
                // localStorage only stores string key/value pairs, so we have to get it as a string
                var item = localStorage.getItem(key);
                // convert the string to a novie object
                var movie = JSON.parse(item);
                // populate the movie history array with the movie object
                movieHistoryList.push(movie);
           }
        }
        // once done looping, populate the page with the saved movies
        addStoredMovies();
    }
    else {
        console.log("Error: you don't have localStorage!");
    }
}

// addStoredMovies() function populates the page with saved movies in localStorage
function addStoredMovies() {  
    for (var i = 0; i < movieHistoryList.length; i++){  
        // recreate the movie list <li> items
        var li = addMovie(movieHistoryList[i].movieName);
        movieList.appendChild(li); 

        // recreate the movie history
        // insert a new table row at the end (-1)
        var row = table.insertRow(-1);

        // the 0th cell (first column) is the name of the Movie
        row.insertCell(0).innerHTML = movieHistoryList[i].movieName;
        // the 1st cell (second column) gets 1 for the first time
        row.insertCell(1).innerHTML = movieHistoryList[i].watched;      
    }
}

// saveMovie() function saves movie objects to localStorage
function saveMovie(movie){ 
    if (localStorage){
        var key = "movie-" + movie.movieName;
        // use the .stringify function to convert the object to a string because 
        // localStorage only stores string key/value pairs
        var item = JSON.stringify(movie);
        localStorage.setItem(key, item);
    }
    else {
        console.log("Error: you don't have localStorage!");
    }
}          

// addMovie() function creates a new list item element to be appended to the ul element 
function addMovie(input){ 
    // reference: https://stackoverflow.com/questions/36035736/add-remove-li-element-from-the-ul-javascript
    var element = document.createElement('li');
    
    // concatenate the input with an [x] for deletion
    element.innerHTML = input + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button>Delete</button>";

    // add an event listener to each list item so that it can be deleted later when clicked
    element.addEventListener('click', function () {
        this.parentNode.removeChild(this);
        
        // when deleting the list item, we also want to decrease the movie history count by 1
        // first store the index of where the input is in the history array
        var listIndex = movieHistoryList.findIndex(i => i.movieName === input);

        // remove from local storage
        var key = "movie-" + movieHistoryList[listIndex].movieName;
        localStorage.removeItem(key);

        // remove the movie from the array
        movieHistoryList.splice(listIndex, 1);
        // delete the movie from the movie history list
        table.deleteRow(listIndex + 1);          
    });    

    return element;
}   

// create a movie object constructor so that we can create movie objects 
function Movie(name, watched){
    this.movieName = name;
    this.watched = watched;
}

// when the "ADD MOVIE" button is clicked...
document.getElementById("add").onclick = function() {
    // get the text input from the user
	var input = titleCase(document.getElementById("addMovieInput").value);
    // store the reference of the Movie History List
    
    // create a variable count to store the number of times a movie is watched
    var count = 0;

    // check if input is empty, null or undefined
    if (!input || input.length === 0){
        // print error message and do nothing
        alert("Please enter a movie before adding.")
    }
    else {   
        // if the Movie History array does not already have the movie
        // reference: https://stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e
        if (!(movieHistoryList.some(e => e.movieName === input))){    
            // only add to the movie list if it doesn't already exist
            var li = addMovie(input);
            // add the new li element to the ul element
            movieList.appendChild(li);   

            // new object with name = input, watched = 1
            var newMovie = new Movie(input, 1);
            // push object into array
            movieHistoryList.push(newMovie);

            // save the movie object to localStorage
            saveMovie(newMovie);

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
            
            // get the current count from the object
            count = movieHistoryList[inputIndex].watched;
            // since the movie already exists, increase the count by one
            count = count + 1;
            // assign the count back to the object
            movieHistoryList[inputIndex].watched = count; 
            // update the table in the watched column        
            table.rows[inputIndex + 1].cells[1].innerHTML = count;

            // save the new watched count to the object in localStorage
            var updateMovie = new Movie(input, count);
            saveMovie(updateMovie);
        }

        // clear the input text box
        clearInput();  
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

    // clear the localStorage
    localStorage.clear();

    // need to clear from movie history table
}
