# Configure Azure provider
provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
}

# Create new resource group
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Reference existing container app environment
data "azurerm_container_app_environment" "main" {
  name                = var.existing_container_env_name  
  resource_group_name = var.existing_container_env_rg  
}

# Create Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Create managed identity for the container app
resource "azurerm_user_assigned_identity" "app_identity" {
  name                = "${var.project_name}-identity"
  resource_group_name = var.resource_group_name
  location            = var.location
}

# Grant ACR pull access to the identity
resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.app_identity.principal_id
}

# Create Container App
resource "azurerm_container_app" "backend" {
    name                         = "${var.project_name}-backend"
  container_app_environment_id = data.azurerm_container_app_environment.main.id  
  resource_group_name         = var.existing_container_env_rg
  revision_mode               = "Single"

  template {
    container {
      name   = "backend"
      image  = "${azurerm_container_registry.acr.login_server}/backend:latest"
      cpu    = 0.5
      memory = "1Gi"
    }
  }

  ingress {
    external_enabled = true
    target_port     = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.app_identity.id]
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    identity            = azurerm_user_assigned_identity.app_identity.id
  }

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.acr.admin_password
  }
}