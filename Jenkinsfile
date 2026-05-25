pipeline {

    agent any

    environment {
        DOCKER_REGISTRY = "bhagya1304"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'main',
                url: 'https://github.com/bhagyalakshmi35023/microservice-project.git'

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
                    --build-arg SERVICE_DIR=user-service \
                    -t ${DOCKER_REGISTRY}/user-service:${IMAGE_TAG} .

                    docker push \
                    ${DOCKER_REGISTRY}/user-service:${IMAGE_TAG}
                    '''
                }
            }
        }

    }

    post {

        success {
            echo "✅ Build Success"
        }

        failure {
            echo "❌ Pipeline Failed"
        }

    }

}

stage('Update Manifest Repo') {

    steps {

        withCredentials([
            usernamePassword(
                credentialsId: 'github-credentials',
                usernameVariable: 'GITHUB_USER',
                passwordVariable: 'GITHUB_TOKEN'
            )
        ]) {

            sh '''
            git clone https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/bhagyalakshmi35023/microservice-gitops.git

            cd microservice-gitops

            sed -i "s|order-service:.*|order-service:${IMAGE_TAG}|g" order-service/deployment.yaml

            git config user.email "jenkins@ci.com"
            git config user.name "Jenkins"

            git add .

            git commit -m "Update order-service image to ${IMAGE_TAG}"

            git push
            '''
        }
    }
}