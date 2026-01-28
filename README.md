# Kubernetes в действии - Марко Лукша
Этой мой проект по изучению Kubernetes основанный на книге указанной выше.

1. Сборка образа из Dockerfile
```bash
docker build -t kubia .
```

1.1 Запуск контейнера из образа
```bash
docker run --name kubia-container -p 8080:8080 -d kubia
```

1.2 Назначить образу другой тег(фактически создается копия образа с новым тегом, так как он имеет тот же идентификатор образа, что и у оригинала)
```bash
docker tag kubia nikolay0110/kubia
```

1.3 Загрузка образа в Registry DockerHub
```bash
docker login
docker push nikolay0110/kubia
```
