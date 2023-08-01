pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('build and deploy') {
            steps {
                sh 'docker-compose up'
            }
        }
        stage('move dist to files') {
            steps {
                sh 'docker cp next-blog-admin:/app/dist /var/jenkins_home/site/next-blog-admin'
                sh 'docker rm -f next-blog-admin'
            }
        }
    }
}
