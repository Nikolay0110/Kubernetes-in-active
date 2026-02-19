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
Получить kubeconfig для кластера для доступа снаружи(я настроил доступ со своего ПК в виртуальную машину)
```bash
minikube kubectl -- config view --minify --flatten > ~/minikube-config.yaml
```

3. Запуск нашего приложения на Node.js в кластере через командную оболочку
```bash
kubectl run kubia --image=nikolay0110/kubia --port=8080
```
Но лучше создать деплоймент нашего приложения, так контроллер Deployment будет следить за нашим приложением и приводить его к указанному состоянию
```bash
kubectl create deployment kubia --image=nikolay0110/kubia --port=8080
```

4. Создание объекта Service - балансировщик нагрузки, для доступа к сервису снаружи кластера
`Примечание!` - Minikube не поддерживает сервис LoadBalancer
```bash
kubectl expose deployment kubia --type=NodePort --name kubia-http --port=8080

узнать внешний интерфейс и порт прослушивания приложения
minikube service kubia-http
```

Посмотреть описание Deployment и Service(LoadBalancer)
```bash
kubectl describe deployment kubia
kubectl describe service kubia-http
```

5. Горизонтальное масштабирования приложения через указание количества реплик нашему деплойменту
```bash
kubectl scale deployment kubia --replicas=3
```

6. Вывод дополнительной информации о поде
```bash
kubectl get pod -o wide
```

7. Развернуть панель управления и мониторинга Kite

[docker-compose.yml](kite-dashboard/docker-compose.yml)

Чтобы kite мог достучаться до minikube, нужно присоединить его к сети minikube, но это я уже указал в docker-compose.yml
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
# или
kubectl apply -f kubia-manual.yaml
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

13. Получить список подов с фильтрацией по селекторам лейблов
```bash
kubectl get pods --show-labels

# с фильтром по меткам и ключ лейбла как отдельный столбец в выводе
kubectl get pods -L creation_method,env   # БЕЗ ПРОБЕЛА МЕЖДУ МЕТКАМИ
# получить поды с фильтром по лейблу
kubectl get pods -l creation_method=manual
# получить список подов с лейблом, каким бы ни было его значение
kubectl get pods -l env
# или получить список подов которые не имеют указанного лейбла 
kubectl get pods -l '!env'
# получить список подов с лейблом значение которого может быть любым кроме указанного
kubectl get pods -l creation_method!=manual
# выбрать поды с несколькими значениями указанного лейбла
kubectl get pods -l 'env in (prod,debug)'
# или на оборот
kubectl get pods -l 'env not in (prod,debug)'
# можно также через запятую указывать селекторы лейблов и их значений
kubectl get pods -l env=prod,creation_method=manual
```

14. Добавить лейбл уже запущенному поду
```bash
kubectl label pod kubia-manual creation_method=manual
# изменение значения у уже имеющегося лейбла
kubectl label pod kubia-manual-v2 env=debug --overwrite
```

15. Добавить лейбл к ноде, чтобы в дальнейшем указывать при раскатке деплоймента или запуске пода конкретный селектор лейбла, например наличие на ноде GPU, это лучше, чем указывать конкретную ноду
```bash
kubectl label node node-name gpu=true
# и получить список нод с указанным лейблом в таблице
kubectl get node -L gpu -l gpu=true
```

**Удалить лейбл**
```bash
kubectl label node minikube gpu-
```

Если под нужно запланировать на определенной ноде, то нужно указать селектор - `kubernetes.io/hostname: фактическое имя хоста`  
Пример:  
```yaml
spec:
  nodeSelector:
    kubernetes.io/hostname: "minikube"    # или какое у вас фактическое имя нужной ноды  
```

16. Получить все пространства имен в кластере - Namespace
```bash
kubectl get ns
# получить список подов в определенном namespace
kubectl get pods --namespace kube-system
# или в сокращенном виде
kubectl get pods -n kube-system
```

17. Получить список контроллеров репликации
```bash
kubectl get rc
```

18. Изменить на лету шаблон пода в контроллере репликации
```bash
kubectl edit rc kubia
```
Но, лучше так не делать, все рекомендуется делать через манифесты, это скорее подойдет для оперативного вмешательства в работу кластера

19. Скейл репликации вручную
```bash
kubectl scale rc kubia --replicas=10
```

20. Удаление контроллера репликации, но с сохранением подов за которыми он следил
```bash
kubectl delete rc kubia --cascade=false
```

21. Получить список ReplicaSet - это набор контроллеров репликации
```bash
kubectl get rs
# удалить контроллер ReplicaSet
kubectl delete rs kubia
```

## DaemonSet
Запуск ровно одного модуля на каждом узле с помощью набора демонов DaemonSet

**Получить список контроллеров DaemonSet**
```bash
kubectl get ds
```
**Удалить контроллер DaemonSet**
```bash
kubectl delete ds ssd-monitor
```

## Job
Запуск подов, выполняющих одну заканчиваемую задачу

**Получить список Jobs**
```bash
kubcetl get jobs
```

**Получить список CronJob**
```bash
kubcetl get cronjob
```

## Service
Службы: обеспечение клиентам возможности обнаружить поды и обмениться с ними информацией по единой точке входа

**Выполнить команду внутри конкретного пода**
Перед запуском команды нужно узнать внутренний IP службы, в которую входит под, куда мы и отправляем команду, а так же порт, в моем случае это 80, поэтому я его не указываю, на этом порту по умолчанию работает HTTP
```bash
# узнать ip службы
kubectl get svc

kubectl exec kubia-btc5b -- curl -s http://10.108.6.148
```

**--** - двойное тире в команде означает окончание параметров для команды `kubectl`, все что идет после - это команда для выполнения внутри пода.

**Конфигурирование сохранения сессий в службах**
У сервисов есть параметр `sessionAffinity`, по умолчанию указан параметр `None`, по можно указать `ClientIP`, тогда обращения от одного клиента будут перенаправлены в конкретный под.

**Сервисы так же могут обрабатывать подключения по одному ip на несколько портов**  
Здесь создаю именованные порты - [kubia-multiports-svc.yaml](kubernetes/service/kubia-multiports-svc.yaml)

**Запрос к приложению через под, в не стандартном пространстве имен**
```bash
# перед командой узнать ip сервиса в нужной неймспейсе и узнать имя пода
kubectl exec kubia-49pmt --namespace kubia-apps -- curl -s http://10.102.130.8:443
```

**ENV пода**
```bash
kubectl exec kubia-43df5 env
```

**Войти в интерактивный режим оболочки терминала в поде**
```bash
kubectl exec -it kubia-43df5 bash
```

**DNS**
Получить доступ к нашему приложению через FQDN, а не через ip
```bash
curl http://kubia-multiports.default.svc.cluster.local
```
Где: `kubia-multiports` - имя службы, `default` - неймспейс, `svc.cluster.local` - суффикс кластера

Или просто
```bash
curl http://kubia-multiports
```