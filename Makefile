REPO=message-api
TIMESTAMP=tmp-$(shell date +%s )
NSPACE=dev
DFILE=mesage.yaml
VERSION=v1

.PHONY: delete
delete:
	kubectl delete deployment kubernetes-frasaja
	kubectl delete service kubernetes-frasaja

.PHONY: create
create:
	@eval $$(minikube docker-env) ;\
	docker image build -t kubernetes-frasaja:v1 ./main
	kubectl create -f ./main/deployment.yaml
	# minikube service kubernetes-frasaja
	# docker run -it -v /var/run/docker.sock:/var/run/docker.sock dood:v1
