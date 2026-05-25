pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "bhagya1304"
        IMAGE_TAG = "${BUILD_NUMBER}"
        MANIFEST_REPO = "https://github.com/bhagyalakshmi35023/microservice-project/k8s-manifests.git"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/bhagyalakshmi35023/microservice-project.git'
            }
        }

        stage('Build & Push - user-service') {

    steps {

        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-credentials',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )
        ]) {

            sh '''
            echo $DOCKER_PASS | docker login \
            -u $DOCKER_USER \
            --password-stdin

            docker build \
            -t ${DOCKER_REGISTRY}/user-service:${IMAGE_TAG} .

            docker push \
            ${DOCKER_REGISTRY}/user-service:${IMAGE_TAG}
            '''
        }
    }
}

        // stage('Build & Push - order-service') {
        //     steps {
        //         script {
        //             docker.withRegistry('', 'dockerhub-credentials') {
        //                 def img = docker.build(
        //                     "${DOCKER_REGISTRY}/order-service:${IMAGE_TAG}",
        //                     "--build-arg SERVICE_DIR=service-b -f Dockerfile ."
        //                 )
        //                 img.push()
        //                 img.push("latest")
        //             }
        //         }
        //     }
        // }

        stage('Update K8s Manifests') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GITHUB_USER',
                    passwordVariable: 'GITHUB_TOKEN'
                )]) {
                    sh """
                        git clone https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/bhagyalakshmi35023/k8s-manifests.git
                        cd k8s-manifests
                        sed -i 's|user-service:.*|user-service:${IMAGE_TAG}|g' k8s/user-service-deployment.yaml
                        sed -i 's|order-service:.*|order-service:${IMAGE_TAG}|g' k8s/order-service-deployment.yaml
                        git config user.email "jenkins@ci.com"
                        git config user.name "Jenkins"
                        git add .
                        git commit -m "Update image tags to ${IMAGE_TAG}"
                        git push
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Image Push Successful - ArgoCD will auto-sync"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
    }
}