variable "db_username" {
  type        = string
  description = "The username for the database"
  sensitive   = true
}

variable "db_name" {
  type        = string
  description = "The name of the database"
}

variable "vpc_name" {
  type        = string
  description = "The name of the VPC"
}

variable "vpc_cidr_block" {
  type        = string
  description = "Base CIDR block for VPC"
  default     = "23.0.0.0/16"
}

variable "subnet_cidr_blocks_public" {
  type        = list(string)
  description = "Base CIDR blocks for the public subnet"
  default = [
    "23.0.1.0/24",
    "23.0.2.0/24",
  ]
}

variable "subnet_cidr_blocks_private" {
  type        = list(string)
  description = "Base CIDR blocks for the private subnet"
  default = [
    "23.0.101.0/24",
    "23.0.102.0/24",
  ]
}

variable "common_tags" {
  type        = map(any)
  description = "Common tags applied to all resources"
}

variable "vpc_availability_zones" {
  type        = list(string)
  description = "Availability zones for each public subnet"
}

variable "region" {
  type        = string
  description = "The region where the resources will be deployed."
}

variable "subnet_count" {
  description = "Number of subnets"
  type        = map(number)

  default = {
    public  = 1,
    private = 2
  }
}

variable "domain_name" {
  description = "Domain name"
  type        = string
}

variable "target_group_arn" {
  description = "ARN of the target group"
  type        = string
  sensitive   = true
}

variable "load_balancer_arn" {
  description = "ARN of the load balancer"
  type        = string
  sensitive   = true
}

variable "ebs_instance_id" {
  description = "ID of the ebs instance"
  type        = string
  sensitive   = true
}
