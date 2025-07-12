terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "fintechgroup"
  location = "eastus"
}

resource "azurerm_container_registry" "acr" {
  name                = "fintechmodelerregistry"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  sku                = "Basic"
  admin_enabled      = true
}

resource "azurerm_container_app_environment" "main" {
  name                = "fintech-env"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
}

resource "azurerm_container_app" "backend" {
  name                         = "backend"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name         = azurerm_resource_group.main.name
  revision_mode               = "Single"

  template {
    container {
      name   = "backend"
      image  = "${azurerm_container_registry.acr.login_server}/backend:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "SPRING_PROFILES_ACTIVE"
        value = "prod"
      }
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
}