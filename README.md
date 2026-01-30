# Kubernetes в действии - Марко Лукош
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

3. Запуск нашего приложения на Node.js в кластере через командную оболочу
```bash
kubectl run kubia --image=nikolay0110/kubia --port=8080
```
но лучше создать деплоймент нашего приложения, так контроллер Deployment будет следить за нашим приложением и приводить его к указанному состоянию
```bash
kubectl create deployment kubia --image=nikolay0110/kubia --port=8080
```

4. Создание объекта Service - балансировщик нагрузки, для доступа к сервисы снаружи кластера
`Примечание!` - Minikube не поддерживает сервис LoadBalancer
```bash
kubectl expose deployment kubia --type=NodePort --name kubia-http --port=8080
minikube service kubia-http
```

Посмотреть описание Deployment и Service(LoadBalancer)
```bash
kubectl describe deployment kubia
kubectl describe service kubia-http
```

5. Горизонатльное масштабирования приложения через указание количества реплик нашему деплойменту
```bash
kubectl scale deployment kubia --replicas=3
```

6. Вывод дополнительной информации о поде
```bash
kubectl get pod -o wide
```







