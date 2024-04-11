pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
            args '-u root --privileged'
        }
    }
    
    stages {
        // stage('Install Playwright') {
        //     steps {
        //         sh '''
        //         npm i -D @playwright/test
        //         npx playwright install
        //         '''
        //     }
        // }
        
        stage('Run Tests') {
            steps {
                withEnv([
                    'URL=https://app.espresa.com/', 
                    'EMAIL=aliaksandr.tsimoshyn@leverx.com', 
                    'PASSWORD=123456789_leverx'
                ]) {
                    sh 'npx playwright test'
                }
            }
            post {
        always {
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'HTML Report'
            ])
        }
    }
        }
    }
}

