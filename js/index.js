document.addEventListener("DOMContentLoaded", () => {
    // Fetch all books and display them
    fetch("http://localhost:3000/books")
      .then(response => response.json())
      .then(books => {
        books.forEach(book => renderBookTitle(book)); // Render each book title
      });
  
    // Function to render book title in the list
    function renderBookTitle(book) {
      const bookList = document.getElementById('list');
      const bookLi = document.createElement('li');
      bookLi.textContent = book.title;
      
      bookLi.addEventListener('click', () => displayBookDetails(book, bookLi));
      bookList.appendChild(bookLi);
    }
  
    // Function to display book details
    function displayBookDetails(book, bookLi) {
      const showPanel = document.getElementById('show-panel');
      showPanel.innerHTML = ''; // Clear previous content
  
      const bookTitle = document.createElement('h2');
      bookTitle.textContent = book.title;
  
      const bookImage = document.createElement('img');
      bookImage.src = book.img_url;
  
      const bookDescription = document.createElement('p');
      bookDescription.textContent = book.description;
  
      const userList = document.createElement('ul');
      book.users.forEach(user => {
        const userLi = document.createElement('li');
        userLi.textContent = user.username;
        userList.appendChild(userLi);
      });
  
      const likeButton = document.createElement('button');
      likeButton.textContent = 'Like ❤️';  // Always show 'Like' first
  
      // Add the click event listener for the like/unlike functionality
      likeButton.addEventListener('click', () => {
        if (likeButton.textContent === 'Like ❤️') {
          likeBook(book, currentUser, userList, likeButton);
        } else {
          unlikeBook(book, currentUser, bookLi, showPanel);
        }
      });
  
      // Append everything to the show panel
      showPanel.append(bookTitle, bookImage, bookDescription, userList, likeButton);
    }
  
    // Function to handle liking a book
    function likeBook(book, currentUser, userList, likeButton) {
      // Add current user to the list of users who liked the book
      const updatedUsers = [...book.users, currentUser];
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          users: updatedUsers
        })
      })
        .then(response => response.json())
        .then(updatedBook => {
          // Update the DOM with the new users who liked the book
          book.users = updatedBook.users;
          const userLi = document.createElement('li');
          userLi.textContent = currentUser.username;
          userList.appendChild(userLi);
  
          // Change the button text to 'Unlike'
          likeButton.textContent = 'Unlike 💔';
        });
    }
  
    // Function to handle unliking a book and removing it from the DOM
    function unlikeBook(book, currentUser, bookLi, showPanel) {
      // Remove current user from the list of users who liked the book
      const updatedUsers = book.users.filter(user => user.id !== currentUser.id);
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          users: updatedUsers
        })
      })
        .then(response => response.json())
        .then(updatedBook => {
          // Update the book object in memory
          book.users = updatedBook.users;
  
          // If the current user unlikes, remove the book from the DOM
          if (!updatedBook.users.some(user => user.id === currentUser.id)) {
            bookLi.remove(); // Remove book from the list
            showPanel.innerHTML = ''; // Clear book details
          }
        });
    }
  
    const currentUser = { id: 1, username: "pouros" }; // Simulate current user
  });
  
  