pipeline {

    agent any

    environment {
        DOCKER_REGISTRY = "bhagya1304"
        IMAGE_TAG = "${BUILD_NUMBER}"
        GITOPS_FILE = "user-service/deployment.yaml"   // ✅ added missing env var
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

        // ✅ stage is now INSIDE the stages block
        stage('Update GitOps Manifest') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-credentials',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {
                    sh '''
                        rm -rf microservice-gitops

                        git clone https://${GIT_USER}:${GIT_TOKEN}@github.com/bhagyalakshmi35023/microservice-gitops.git
                        cd microservice-gitops

                        # ✅ set authenticated remote so push works
                        git remote set-url origin https://${GIT_USER}:${GIT_TOKEN}@github.com/bhagyalakshmi35023/microservice-gitops.git

                        # ✅ fixed: user-service (not order-service)
                        sed -i "s|${DOCKER_REGISTRY}/user-service:.*|${DOCKER_REGISTRY}/user-service:${IMAGE_TAG}|g" \
                            ${GITOPS_FILE}

                        git config user.email "jenkins@ci.local"
                        git config user.name "Jenkins"

                        # ✅ fixed: user-service/deployment.yaml
                        git add user-service/deployment.yaml
                        git commit -m "ci: update user-service image to :${IMAGE_TAG} [skip ci]"
                        git push origin main
                    '''
                }
            }
        }

    }   // ✅ closes stages

    post {
        success { echo "✅ Build & Deploy Triggered" }
        failure { echo "❌ Pipeline Failed" }
    }

}   // ✅ closes pipeline