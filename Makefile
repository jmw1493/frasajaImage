# before running 'make create'
# run 'minikube mount /path/to/frasajaImage/test:/mount-9p'
# in new tab in terminal shell

.PHONY: delete
delete:
	kubectl delete deployment my-deployment
	kubectl delete service my-service

	kubectl delete deployment kubernetes-frasaja
	kubectl delete service kubernetes-frasaja

.PHONY: create
create:
	@eval $$(minikube docker-env) ;\

	# cd ./main
	# npm run build
	# cd ../

	docker image build -t my-server:v1 ./test
	kubectl create -f ./test/deployment.yaml

	docker image build -t kubernetes-frasaja:v1 ./main
	kubectl create -f ./main/deployment.yaml

	# minikube service kubernetes-frasaja
	# minikube service my-service
	# docker run -it -v /var/run/docker.sock:/var/run/docker.sock dood:v1
