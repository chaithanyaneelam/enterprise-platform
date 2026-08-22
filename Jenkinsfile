pipeline {
    agent any

    environment {
        IMAGE_NAME = 'enterprise-platform:latest'
        CONTAINER_NAME = 'enterprise-platform-container'
        HOST_PORT = '8085'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from Git...'
                checkout scm
            }
        }

        stage('Code Validation') {
            steps {
                echo 'Validating frontend assets & static configurations...'
                script {
                    if (isUnix()) {
                        sh 'ls -la index.html styles.css app.js Dockerfile'
                    } else {
                        bat 'dir index.html styles.css app.js Dockerfile'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Enterprise Platform Docker Image...'
                script {
                    if (isUnix()) {
                        sh 'docker build -t ${IMAGE_NAME} .'
                    } else {
                        bat 'docker build -t %IMAGE_NAME% .'
                    }
                }
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Deploying Enterprise Platform Docker Container...'
                script {
                    if (isUnix()) {
                        sh 'docker rm -f ${CONTAINER_NAME} 2>/dev/null || true'
                        sh 'docker run -d -p ${HOST_PORT}:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}'
                    } else {
                        bat 'docker rm -f %CONTAINER_NAME% 2>NUL || echo Container stopped'
                        bat 'docker run -d -p %HOST_PORT%:80 --name %CONTAINER_NAME% %IMAGE_NAME%'
                    }
                }
            }
        }

        stage('Health Verification') {
            steps {
                echo 'Verifying container deployment health...'
                script {
                    if (isUnix()) {
                        sh 'curl -s http://localhost:8085 | grep -i "OmniPolicy"'
                    } else {
                        bat 'curl -s http://localhost:8085 | findstr /I "OmniPolicy"'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Enterprise Policy Administration Platform CI/CD Pipeline Completed Successfully!'
        }
        failure {
            echo 'Pipeline Execution Failed. Please check Jenkins logs.'
        }
    }
}
