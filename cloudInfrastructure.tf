# Set provider.
provider "aws" {
  region = "eu-north-1"
}

# ==================================================================================================

# Create a User Pool.
resource "aws_cognito_user_pool" "nutricompanion_pool" {
  name = "NutriCompanion"

 admin_create_user_config {
    allow_admin_create_user_only = "false"
  }

  alias_attributes         = ["email"]
  auto_verified_attributes = ["email"]
  deletion_protection      = "INACTIVE"

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  mfa_configuration = "OPTIONAL"

  password_policy {
    minimum_length                   = "8"
    require_lowercase                = "true"
    require_numbers                  = "true"
    require_symbols                  = "true"
    require_uppercase                = "true"
    temporary_password_validity_days = "7"
  }

  software_token_mfa_configuration {
    enabled = "true"
  }

  user_attribute_update_settings {
    attributes_require_verification_before_update = ["email"]
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }

}

resource "aws_cognito_user_pool_domain" "nutricompanion_user_pool_domain" {
  domain       = "nutricompanion"
  user_pool_id = aws_cognito_user_pool.nutricompanion_pool.id
}


resource "aws_cognito_identity_provider" "google" {
  user_pool_id         = aws_cognito_user_pool.nutricompanion_pool.id
  provider_name        = "Google"
  provider_type        = "Google"
  provider_details     = {
    client_id = "765800523086-s225su8r2v742u7m4m13ve15ga9o580o.apps.googleusercontent.com"
    client_secret = "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"
    authorize_scopes = "email profile openid"

  }
  attribute_mapping    = {
    email       = "email"
    username    = "sub"
  }
}


# ==================================================================================================


# Create a User Pool Client.
resource "aws_cognito_user_pool_client" "nutricompanion_client" {
  name = "NutriCompanionClient"
  user_pool_id = aws_cognito_user_pool.nutricompanion_pool.id

  generate_secret = false

  callback_urls = [ "http://localhost:6969" ]

  allowed_oauth_flows = ["implicit"]
  allowed_oauth_scopes = ["email", "phone", "openid"]
  allowed_oauth_flows_user_pool_client = true
  supported_identity_providers = ["Google"]

  explicit_auth_flows = [ 
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
   ]
  
}


# ==================================================================================================


# Values to output.

output "Cognito-Domain" {
  value = "https://${aws_cognito_user_pool_domain.nutricompanion_user_pool_domain.domain}.auth.eu-north-1.amazoncognito.com/"
}

output "Hosted-Web-UI" {
    value = "https://${aws_cognito_user_pool_domain.nutricompanion_user_pool_domain.domain}.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=${aws_cognito_user_pool_client.nutricompanion_client.id}&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A6969"

}

# ==================================================================================================