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
                bat 'dir index.html styles.css app.js Dockerfile'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Enterprise Platform Docker Image...'
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Deploying Enterprise Platform Docker Container...'
                bat 'docker rm -f %CONTAINER_NAME% 2>NUL || echo Container stopped'
                bat 'docker run -d -p %HOST_PORT%:80 --name %CONTAINER_NAME% %IMAGE_NAME%'
            }
        }

        stage('Health Verification') {
            steps {
                echo 'Verifying container deployment health...'
                bat 'curl -s http://localhost:8085 | findstr /I "OmniPolicy"'
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
