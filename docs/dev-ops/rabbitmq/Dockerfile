ARG PLUGIN_VERSION=3.12.0

FROM rabbitmq:3.12.10-management

ARG PLUGIN_VERSION

# Install curl
RUN apt-get update && apt-get install -y curl

# Download the rabbitmq_delayed_message_exchange plugin
RUN curl -fsSL \
    	-o /plugins/rabbitmq_delayed_message_exchange-${PLUGIN_VERSION}.ez \
    	https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v${PLUGIN_VERSION}/rabbitmq_delayed_message_exchange-${PLUGIN_VERSION}.ez

RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange
