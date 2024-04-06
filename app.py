from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

# Функция для получения количества подписок профиля GitHub
def get_github_profile_following(username):
    url = f"https://api.github.com/users/{username}/traffic/views"
    response = requests.get(url)
    if response.status_code == 200:
        views_data = response.json()
        total_views = views_data.get("count")
        views_last_week = views_data.get("views")[0].get("count")  # Получаем просмотры за последнюю неделю
        return total_views, views_last_week
    else:
        print("Failed to fetch data:", response.status_code)
        return None, None

# Главная страница с счетчиком подписок
@app.route("/")
def index():
    username = "Lyranaut"  # Здесь указываем ваше имя пользователя GitHub
    return render_template("index.html", username=username)

if __name__ == "__main__":
    app.run()#(debug=False,host='0.0.0.0')
