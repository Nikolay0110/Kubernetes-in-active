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

2. Настройка кластера в Minikube
Установка minikube
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
```
Получить kubeconfig для кластера для доступа снаружи(я настроил доступ со своего ПК в киртуальную машину)
```bash
minikube kubectl -- config view --minify --flatten > ~/minikube-config.yaml
```
