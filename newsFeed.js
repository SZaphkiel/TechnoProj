document.querySelectorAll('.likeButton').forEach(function(btn) {
    btn.addEventListener('click', function() {
        btn.classList.toggle('liked');
    });
});

function getSavedPosts() {
    return JSON.parse(localStorage.getItem('posts') || '[]');
}
function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function renderPosts() {
    const midContainer = document.querySelector('.midContainer');
    const postingCard = document.querySelector('.postingCard');

    // Remove previously rendered dynamic posts
    document.querySelectorAll('.dynamicPost').forEach(el => el.remove());

    const posts = getSavedPosts();
    posts.forEach(postData => {
        const post = document.createElement('div');
        post.className = 'samplePost dynamicPost';
        post.innerHTML = `
            <div class="postHeader">
                <div class="postProfile">
                    <img src="${postData.img}" alt="Profile Image">
                    <div>
                        <div class="postProfileName">${postData.name}</div>
                        <div class="postProfileRole">${postData.role}</div>
                    </div>
                </div>
                ${postData.name === "John Patrick Tubino" ? `<button class="deletePostBtn" title="Delete Post">✖</button>` : ""}
            </div>
            <div class="postContent">
                <p>${postData.text}</p>
            </div>
            <div class="interactionPanel">
                <div class="likeButton${postData.liked ? ' liked' : ''}">
                    <img src="./subImages/like.png" alt="Like">
                    <span>Like</span>
                </div>
                <div class="commentButton">
                    <img src="./subImages/comment.png" alt="Comment">
                    <span>Comment</span>
                </div>
                <div class="shareButton">
                    <img src="./subImages/share.png" alt="Share">
                    <span>Share</span>
                </div>
            </div>
        `;
        midContainer.insertBefore(post, postingCard.nextSibling);

        // Like button event
        post.querySelector('.likeButton').addEventListener('click', function() {
            this.classList.toggle('liked');
            postData.liked = this.classList.contains('liked');
            savePosts(posts);
        });

        // Delete button event (if present)
        const delBtn = post.querySelector('.deletePostBtn');
        if (delBtn) {
            delBtn.addEventListener('click', function() {
                const allPosts = getSavedPosts();
                const idx = allPosts.findIndex(
                    p => p.name === postData.name && p.text === postData.text
                );
                if (idx !== -1) {
                    allPosts.splice(idx, 1);
                    savePosts(allPosts);
                    renderPosts();
                }
            });
        }
    });
}

// Save new post to localStorage
function addPost(text) {
    const posts = getSavedPosts();
    posts.unshift({
        img: "./subImages/japepe.jpg",
        name: "John Patrick Tubino",
        role: "Student",
        text: text.replace(/\n/g, '<br>'),
        liked: false
    });
    savePosts(posts);
    renderPosts();
}

// --- To-Do List Logic ---
function getTodos() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
}
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function renderTodos() {
    const todoList = document.querySelector('.toDoContent ul');
    if (!todoList) return;
    todoList.innerHTML = '';
    const todos = getTodos();
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `📌 <span>${todo}</span> <button class="removeTodo" data-idx="${idx}" title="Remove" style="margin-left:10px;background:none;border:none;color:#d32f2f;font-size:1.1em;cursor:pointer;">✖</button>`;
        todoList.appendChild(li);
    });
    // Remove event
    todoList.querySelectorAll('.removeTodo').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            const todos = getTodos();
            todos.splice(idx, 1);
            saveTodos(todos);
            renderTodos();
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    renderPosts();

    const form = document.querySelector('.postingContent form');
    const textarea = form.querySelector('textarea');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = textarea.value.trim();
        if (!text) return;
        addPost(text);
        textarea.value = '';
    });

    // Tab switching logic for For You, Trending, Your Class
    const tabButtons = document.querySelectorAll('.foryouTab');
    const tabTitle = document.getElementById('forYouTabTitle');
    const tabContent = document.getElementById('forYouTabContent');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.dataset.tab === 'foryou') {
                tabTitle.textContent = 'For You';
                tabContent.innerHTML = `<p>Check out the latest updates from your friends and colleagues.</p>`;
                document.querySelectorAll('.samplePost').forEach(post => post.style.display = '');
            } else if (btn.dataset.tab === 'trending') {
                tabTitle.textContent = 'Trending';
                tabContent.innerHTML = `<p>See the most engaging posts right now.</p>`;
                // Show only trending posts (example: posts with most likes)
                showTrendingPosts();
            } else if (btn.dataset.tab === 'yourclass') {
                tabTitle.textContent = 'Your Class';
                tabContent.innerHTML = `<p>Posts from your class only.</p>`;
                // Show only posts from your class (example: filter by name/role)
                showClassPosts();
            }
        });
    });

    function showTrendingPosts() {
        // Example: Show posts with liked=true or most likes (simple demo)
        document.querySelectorAll('.samplePost').forEach(post => {
            const likeBtn = post.querySelector('.likeButton');
            if (likeBtn && likeBtn.classList.contains('liked')) {
                post.style.display = '';
            } else {
                post.style.display = 'none';
            }
        });
    }

    function showClassPosts() {
        // Example: Show posts by "John Patrick Tubino" (replace with your class logic)
        document.querySelectorAll('.samplePost').forEach(post => {
            const name = post.querySelector('.postProfileName');
            if (name && name.textContent.includes('John Patrick Tubino')) {
                post.style.display = '';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Dropdown logic for headerNav icons
    // Dropdowns for headerNav
    const navIcons = document.querySelectorAll('.headerNav ul li');
    const dropdownData = [
        {
            title: "Messages",
            content: `<div style="padding:16px;">No new messages.</div>`
        },
        {
            title: "Notifications",
            content: `<div style="padding:16px;">No new notifications.</div>`
        },
        {
            title: "Menu",
            content: `<div style="padding:16px;">
                <a href="profilePage.html" style="display:block;margin-bottom:8px;">Profile</a>
                <a href="#" style="display:block;margin-bottom:8px;">Settings</a>
                <a href="#" style="display:block;">Logout</a>
            </div>`
        }
    ];

    // Remove any existing dropdowns
    function closeDropdowns() {
        document.querySelectorAll('.headerDropdown').forEach(d => d.remove());
    }

    navIcons.forEach((icon, i) => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeDropdowns();

            // Create dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'headerDropdown';
            dropdown.innerHTML = `
                <div class="headerDropdownTitle">${dropdownData[i].title}</div>
                <div class="headerDropdownContent">${dropdownData[i].content}</div>
            `;
            const ul = icon.parentElement;
            // Shift left a bit more (change -40 to -80 or adjust as needed)
            dropdown.style.position = 'absolute';
            dropdown.style.top = (icon.offsetTop + icon.offsetHeight + 8) + 'px';
            dropdown.style.left = (icon.offsetLeft - 80) + 'px';
            dropdown.style.minWidth = '180px';
            dropdown.style.zIndex = 2000;

            ul.appendChild(dropdown);

            setTimeout(() => {
                document.addEventListener('click', closeDropdowns, { once: true });
            }, 10);
        });
    });

    // To-Do Add Logic
    const todoHeader = document.querySelector('.toDoHeader');
    if (todoHeader) {
        // Remove any existing input
        const oldInput = document.querySelector('.toDoInput');
        if (oldInput) oldInput.remove();

        // Create input and place beside add +
        const input = document.createElement('input');
        input.className = 'toDoInput';
        input.type = 'text';
        input.placeholder = 'Add a to-do...';
        input.style = 'margin-left:10px;width:60%;padding:6px 10px;border-radius:8px;border:1px solid #e0e0e0;font-size:1em;vertical-align:middle;';

        // Insert input right before the add+ <p>
        const addBtn = todoHeader.querySelector('p');
        todoHeader.insertBefore(input, addBtn);

        // Add click event to add+
        addBtn.style.cursor = 'pointer';
        addBtn.onclick = function() {
            input.focus();
            const value = input.value.trim();
            if (value) {
                const todos = getTodos();
                todos.push(value);
                saveTodos(todos);
                renderTodos();
                input.value = '';
            }
        };

        // Also allow Enter key to add
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                addBtn.onclick();
            }
        });
    }
    renderTodos();
});