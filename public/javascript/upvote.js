
async function upvoteClickHandler(event) {
    event.preventDefault();

    // console.log("upvote button clicked!")
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    // checked with http://localhost:3001/post/4 and `id is 4`
    // console.log(id);

    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);