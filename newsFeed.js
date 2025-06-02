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


    const posts = getSavedPosts();
    posts.forEach(postData => {
        const post = document.createElement('div');
        post.className = 'samplePost';
        post.innerHTML = `
            <div class="postHeader">
                <div class="postProfile">
                    <img src="${postData.img}" alt="Profile Image">
                    <div>
                        <div class="postProfileName">${postData.name}</div>
                        <div class="postProfileRole">${postData.role}</div>
                    </div>
                </div>
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

// Initial render on page load
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
});