pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('build') {
            steps {
                sh 'docker build -t next-blog-admin .'
            }
        }
        stage('deploy') {
            steps {
                sh 'docker run --name next-blog-admin next-blog-admin'
                sh 'docker cp next-blog-admin:/app/dist /var/jenkins_home/site/next-blog-admin-front'
                sh 'docker rm -f next-blog-admin'
            }
        }
    }
}
