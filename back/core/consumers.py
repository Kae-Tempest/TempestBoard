import json

from channels.generic.websocket import WebsocketConsumer
from core.serializers import ActivitySerializer


def send_message(self, message: dict | str):
    if isinstance(message, dict):
        message = json.dumps(message)
    for connection in self.connections:
        connection.send(text_data=message)

class PresenceConsumer(WebsocketConsumer):
    connections = []

    def connect(self):
        self.accept()
        self.user = self.scope['user']
        self.connections.append(self)
        self.update_indicator(msg="Connected")

    def disconnect(self, code):
        self.update_indicator(msg="Disconnected")
        self.connections.remove(self)
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        for connection in self.connections:
            connection.send(
                text_data=json.dumps({
                    "msg": f"{self.user} {text_data}",
                    "online": f"{len(self.connections)}",
                    "users": [f"{user.scope['user']}" for user in self.connections]
                }),
            )

    def update_indicator(self, msg: str):
        json_to_send = json.dumps({
            "msg": f"{self.user} {msg}",
            "online": f"{len(self.connections)}",
            "users": [f"{user.scope['user']}" for user in self.connections]
        })
        send_message(self, json_to_send)

class ActivityConsumer(WebsocketConsumer):
    connections = []
    def connect(self):
        self.accept()
        self.connections.append(self)
        msg = json.dumps({"msg": "Connected"})
        send_message(self, msg)

    def disconnect(self, code):
        msg = json.dumps({"msg": "Disconnected"})
        send_message(self, msg)
        self.connections.remove(self)
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        serializer = ActivitySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            for connection in self.connections:
                send_message(connection, serializer.data)
        else:
            for connection in self.connections:
                send_message(connection, json.dumps({"msg": f"{serializer.errors}"}))
