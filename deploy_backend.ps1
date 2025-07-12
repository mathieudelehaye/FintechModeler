# Variables
$resourceGroupName = "fintechgroup"
$registryName = "fintechmodelerregistry"
$imageName = "backend"
$imageTag = "latest"

# Build the application
Write-Host "Building Spring Boot application..." -ForegroundColor Green
Set-Location -Path ".\backend"
.\gradlew.bat clean bootJar
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build Spring Boot application"
    exit 1
}

# Get ACR credentials
Write-Host "Getting ACR credentials..." -ForegroundColor Green
$acrCredentials = az acr credential show `
    --resource-group $resourceGroupName `
    --name $registryName | ConvertFrom-Json

# Log in to ACR
Write-Host "Logging in to ACR..." -ForegroundColor Green
$password = $acrCredentials.passwords[0].value
$loginServer = "$registryName.azurecr.io"
docker login $loginServer -u $registryName -p $password

# Build Docker image
Write-Host "Building Docker image..." -ForegroundColor Green
docker build -t "$loginServer/$imageName`:$imageTag" .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build Docker image"
    exit 1
}

# Push image to ACR
Write-Host "Pushing image to ACR..." -ForegroundColor Green
docker push "$loginServer/$imageName`:$imageTag"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to push Docker image"
    exit 1
}

# Initialize and apply Terraform
Write-Host "Applying Terraform configuration..." -ForegroundColor Green
Set-Location -Path "..\infrastructure"
terraform init
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to initialize Terraform"
    exit 1
}

terraform apply -auto-approve
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to apply Terraform configuration"
    exit 1
}

Write-Host "Deployment completed successfully!" -ForegroundColor Green

# Get the application URL
$containerAppUrl = az container app show `
    --resource-group $resourceGroupName `
    --name $imageName `
    --query "properties.latestRevision.fqdn" `
    --output tsv

Write-Host "Application is available at: https://$containerAppUrl" -ForegroundColor Green