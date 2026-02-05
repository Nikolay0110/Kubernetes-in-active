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

7. Развернуть панель управления и мониторинга Kite

[docker-compose.yml](kite-dashboard/docker-compose.yml)

Чтобы kite мог достучаться до minikube, нужно присоеденить его к сети minikube, но это я уже указал в docker-compose.yml
```bash
docker network connect minikube kite-dash
```

8. Узнать какие поля возможны у объекта для его создания или описания и деплоя
```bash
kubectl explain pods
# и для детального изучения например
kubectl explain pods.spec
```

9. Создание пода из манифеста
```bash
kubectl create -f kubia-manual.yaml
```

10. Получить описание объекта в виде YAML или JSON
```bash
kubectl get pod kubia-manual -o yaml
kubectl get pod kubia-manual -o json
```

11. Просмотреть логи пода
```bash
kubectl logs kubia-manual
# в режиме реального времени
kubectl logs -f kubia-manual
```
**Если под многоконтейнерный, то просмотр логов отдельного контейнера делается следующим образом**
```bash
kubectl logs kubia-manual -c kubia  # где флаг -c означает, что можно указать имя контейнера
```

12. Перенаправление портов пода на порт ноды
В данном примере мы перенаправляем порт приложения 8080 на порт ноды 8082
```bash
kubectl port-forward kubia-manual 8082:8080
```







