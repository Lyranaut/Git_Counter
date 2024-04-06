// Получаем элемент счетчика просмотров
var viewsCounter = document.getElementById("views-counter");

// Функция для обновления счетчика просмотров
function updateViews(username) {
    fetch(`/update_views/${username}`)
        .then(response => response.json())
        .then(data => {
            viewsCounter.innerText = data.total_views;
        })
        .catch(error => console.error('Ошибка:', error));
}

// Вызываем функцию обновления при загрузке страницы
window.onload = function() {
    var username = "Lyranaut";  // Замените на ваше имя пользователя GitHub
    updateViews(username);
}

// Функция для поиска пользователя GitHub и обновления информации о нем
function searchUser() {
    var searchInput = document.getElementById("search");
    var usernameDisplay = document.getElementById("username");
    var totalFollowingDisplay = document.getElementById("total-following");
    var totalFollowersDisplay = document.getElementById("total-followers");
    var mostViewedRepoDisplay = document.getElementById("most-viewed-repo");
    var username = searchInput.value.trim(); // Получаем введенное имя пользователя

    // Очищаем содержимое от предыдущего поиска
    usernameDisplay.textContent = "";
    totalFollowingDisplay.textContent = "Loading...";
    totalFollowersDisplay.textContent = "Loading...";
    mostViewedRepoDisplay.textContent = "Loading...";

    // Запрос на получение информации о пользователе GitHub
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            // Обновляем отображение имени пользователя, количества подписок и подписчиков
            usernameDisplay.textContent = data.login;
            totalFollowingDisplay.textContent = data.following;
            totalFollowersDisplay.textContent = data.followers;

            // Запрос на получение списка репозиториев пользователя
            fetch(data.repos_url)
                .then(response => response.json())
                .then(repos => {
                    // Находим репозиторий с наибольшим количеством просмотров
                    let mostViewedRepo = repos.reduce((max, repo) => (repo.watchers_count > max.watchers_count) ? repo : max);
                    // Создаем ссылку на репозиторий
                    let repoLink = document.createElement('a');
                    repoLink.href = mostViewedRepo.html_url;
                    repoLink.textContent = mostViewedRepo.full_name;
                    // Вставляем ссылку в элемент на странице
                    mostViewedRepoDisplay.innerHTML = '';
                    mostViewedRepoDisplay.appendChild(repoLink);
                })
                .catch(error => {
                    console.error('Error fetching repositories:', error);
                    mostViewedRepoDisplay.textContent = "Error fetching repositories";
                });
        })
}