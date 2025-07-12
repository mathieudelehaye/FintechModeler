# variables.tf

# Basic configuration variables
variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  sensitive   = true
}

variable "location" {
  description = "Azure region location"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Deployment environment (dev, prod)"
  type        = string
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  sensitive   = true
}

variable "acr_name" {
  description = "Name of the ACR"
  type        = string
  sensitive   = true
}

# Authentication variables
variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
  sensitive   = true
}

variable "tenant_id" {
  description = "Azure tenant ID"
  type        = string
  sensitive   = true
}

variable "client_id" {
  description = "Azure client ID"
  type        = string
  sensitive   = true
}

variable "client_secret" {
  description = "Azure client secret"
  type        = string
  sensitive   = true
}

variable "existing_container_env_name" {
  description = "Name of the existing Container App Environment"
  type        = string
  default     = "calorie-tracker-env"
  sensitive   = true
}

variable "existing_container_env_rg" {
  description = "Resource Group of the existing Container App Environment"
  type        = string
  default     = "calorie-tracker-rg"
  sensitive   = true
} 