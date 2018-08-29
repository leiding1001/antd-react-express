pipeline {
  agent {
    docker {
      image 'node:6-alpine'
      args '-p 3000:3000'
    }

  }
  stages {
    stage('Install') {
      steps {
        sh 'npm install -g cnpm --registry=https://registry.npm.taobao.org'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run dist-test'
      }
    }
    stage('Deploay') {
      steps {
        sh '''time_build=$(date +"%Y%m%dT%H%M")
'''
        sh 'tar zcf build_${time_build}.tar.gz build/'
      }
    }
  }
  environment {
    CI = 'true'
  }
}