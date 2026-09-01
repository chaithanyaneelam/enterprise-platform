pipeline {
    agent any

    environment {
        AWS_HOST = '16.171.33.162'
        AWS_USER = 'ubuntu'
        CONTAINER_NAME = 'enterprise-platform'
        IMAGE_NAME = 'enterprise-platform:latest'
        HOST_PORT = '80'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Code Validation') {
            steps {
                echo 'Validating project files...'

                sh '''
                    ls -la
                    test -f index.html
                    test -f styles.css
                    test -f app.js
                    test -f Dockerfile
                    test -f Jenkinsfile
                '''
            }
        }

        stage('Test AWS SSH Connection') {
            steps {
                echo 'Testing SSH connection to AWS EC2...'

                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'aws-ec2-ssh',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        chmod 600 "$SSH_KEY"

                        ssh \
                          -i "$SSH_KEY" \
                          -o StrictHostKeyChecking=no \
                          -o ConnectTimeout=10 \
                          "$SSH_USER@$AWS_HOST" \
                          "echo AWS_CONNECTION_SUCCESSFUL"
                    '''
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                echo 'Deploying latest version to AWS EC2...'

                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'aws-ec2-ssh',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {

                    sh '''
                        chmod 600 "$SSH_KEY"

                        ssh \
                          -i "$SSH_KEY" \
                          -o StrictHostKeyChecking=no \
                          "$SSH_USER@$AWS_HOST" << 'REMOTE_SCRIPT'

                            set -e

                            echo "======================================"
                            echo "Connected to AWS EC2"
                            echo "======================================"

                            cd ~/enterprise-platform

                            echo "Pulling latest code from GitHub..."
                            git fetch origin
                            git reset --hard origin/main

                            echo "Building Docker image..."
                            docker build \
                                -t enterprise-platform:latest \
                                .

                            echo "Stopping old container..."
                            docker rm -f enterprise-platform 2>/dev/null || true

                            echo "Starting new container..."
                            docker run -d \
                                --name enterprise-platform \
                                -p 80:80 \
                                enterprise-platform:latest

                            echo "Waiting for application..."
                            sleep 5

                            echo "Checking container..."
                            docker ps

                            echo "Checking application health..."
                            curl -fsS http://localhost | grep -i "OmniPolicy"

                            echo "======================================"
                            echo "AWS DEPLOYMENT SUCCESSFUL"
                            echo "======================================"

REMOTE_SCRIPT
                    '''
                }
            }
        }

        stage('Deployment Verification') {
            steps {
                echo 'Verifying public AWS application...'

                sh '''
                    curl -fsS http://16.171.33.162 | grep -i "OmniPolicy"
                '''
            }
        }
    }

    post {
        success {
            echo '======================================'
            echo 'CI/CD DEPLOYMENT SUCCESSFUL!'
            echo 'Application deployed to AWS EC2.'
            echo 'URL: http://16.171.33.162'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo 'CI/CD PIPELINE FAILED'
            echo 'Check the Console Output.'
            echo '======================================'
        }
    }
}