# before running 'make create'
# run 'minikube mount /path/to/frasajaImage/test:/mount-9p'
# in new tab in terminal shell

.PHONY: delete
delete:
	kubectl delete deployment kubernetes-frasaja
	kubectl delete service kubernetes-frasaja
	kubectl delete deployment my-deployment
	kubectl delete service my-service
	kubectl delete service test2


.PHONY: create
create:
	@eval $$(minikube docker-env) ;\
	docker build -t kubernetes-frasaja:v1 ./main
	kubectl create -f ./main/deployment.yaml

.PHONY: build
build:
	docker build -t kubernetes-frasaja:v1 ./main
