document.addEventListener("readystatechange", e => {
    if (e.target.readyState === "complete") {
        loadData();
    }
});

async function loadData() {
    const data = await fetch("/api?action=gettop10&track=4");
    // Anything you do with the data has to happen after you fetch the data using async/await
    const formatted = await data.json();
    const headline = document.querySelector('h2');
    headline.textContent = formatted[0].studentid;
}

