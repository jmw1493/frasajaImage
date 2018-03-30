# before running 'make create'
# run 'minikube mount /path/to/frasajaImage/test:/mount-9p'
# in new tab in terminal shell

.PHONY: delete
delete:
	kubectl delete deployment kubernetes-frasaja
	kubectl delete service kubernetes-frasaja
	# docker rmi kubernetes-frasaja:v1 -f

	kubectl delete deployment my-deployment
	kubectl delete service my-service
	docker rmi my-server:v1 -f


.PHONY: create
create:
	@eval $$(minikube docker-env) ;\

	# docker build -t my-server:v1 ./test

	docker build -t kubernetes-frasaja:v1 ./main
	kubectl create -f ./main/deployment.yaml

