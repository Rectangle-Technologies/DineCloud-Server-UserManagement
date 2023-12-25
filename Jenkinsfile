pipeline {
    agent any
    
    environment {
        docker_image_name = "dinecloud_server_usermanagement"
        docker_image_tag = "latest"
        docker_username = "rectangletechnologies"
        docker_hub_cred = "docker_hub_rect_tech"
        version = "latest"
        folder_path = "."
        repo_url = "https://github.com/Rectangle-Technologies/DineCloud-Server-DomainModel"
    }
    
    stages {
        stage("Cloning GitHub Repo") {
            steps {
                echo "Cloning code from GitHub"
                git branch: 'RELEASE', url: "${repo_url}"
            }
        }
    
        stage("Manual approval") {
            steps {
                script {
                    def packageJsonContents = readFile("${folder_path}/package.json")
                    def packageJson = readJSON text: packageJsonContents    
                    
                    def packageName = packageJson.name
                    def packageVersion = packageJson.version
                    
                    // Deploy to "name/version" path in S3
                    def deployPath = "${packageName}/${packageVersion}"
                    
                    // Display extracted information
                    echo "Package Name: ${packageName}"
                    echo "Package Version: ${packageVersion}"
                    
                    // Manual approval step
                    input(message: "Proceed with deploying to ${deployPath}?", ok: "Deploy")
                }
            }
        }
        
        stage("Install npm packages") {
            steps {
                dir("${folder_path}") {
                    echo "Installing npm dependencies"
                    bat "npm install"
                }
            }
        }
        
        stage("Run Tests") {
            steps {
                echo "Running tests"
                // bat "npm test"
            }
        }
        
        stage("Building docker image") {
            steps {
                dir("${folder_path}") {
                    // Build Docker image
                    bat "docker build -t dinecloud_server_usermanagement:${env.BUILD_NUMBER} ."
                }
            }
        }
        
         stage('Push to Registry') {
            steps {
                dir("${folder_path}") {
                    script {
                        // Log in to Docker Hub using Jenkins credentials
                        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: "${docker_hub_cred}", usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD']]) {
                            // Log in to Docker Hub
                            try {
                                bat "docker login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}"
                            } catch (err) {
                                echo "Error logging in to Docker Hub: ${err}"
                                error "Error logging in to Docker Hub: ${err}"
                            }
                        }
                        // remove latest local image if exists
                        try {
                            bat "docker rmi ${docker_username}/${docker_image_name}:latest"
                        } catch (err) {
                            echo "No local image to remove: ${docker_username}/${docker_image_name}:latest"
                        }

                        // Push Docker image to registry
                        bat "docker tag ${docker_image_name}:${env.BUILD_NUMBER} ${docker_username}/${docker_image_name}:${env.BUILD_NUMBER}"
                        bat "docker tag ${docker_image_name}:${env.BUILD_NUMBER} ${docker_username}/${docker_image_name}:latest"

                        bat "docker push ${docker_username}/${docker_image_name}:${env.BUILD_NUMBER}"
                        bat "docker push ${docker_username}/${docker_image_name}:latest"

                        // remove local image
                        bat "docker rmi ${docker_username}/${docker_image_name}:${env.BUILD_NUMBER}"
                        bat "docker rmi ${docker_image_name}:${env.BUILD_NUMBER}"
                    }
                }
            }
        }
    }
}