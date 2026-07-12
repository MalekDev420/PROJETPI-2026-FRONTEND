pipeline {
    agent any
    stages {
        stage('Récupérer le code') {
            steps { checkout scm }
        }
        stage('Construire le site') {
            steps {
                bat 'npm install'
                bat 'npm run build'
            }
        }
        stage('Fabriquer la boîte Docker') {
            steps {
                script {
                    docker.withRegistry('', 'ocker-hub-credentials') {
                        def img = docker.build("malekdev80/mon-frontend-web")
                        img.push("latest")
                    }
                }
            }
        }
        stage('Déployer') {
            steps {
                bat 'docker-compose up -d --force-recreate'
            }
        }
    }
}